"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getpublicip_1 = __importDefault(require("./scripts/getpublicip"));
const webserver_1 = __importDefault(require("./scripts/webserver"));
const server_socket_1 = __importDefault(require("./scripts/server-socket"));
const udpserver_1 = require("./scripts/udpserver");
(async () => {
    const ipAddress = await (0, getpublicip_1.default)();
    console.log("Öffentliche IP-Adresse: " + ipAddress);
    webserver_1.default.start();
    console.log("Server gestartet");
    server_socket_1.default.start(webserver_1.default.httpServer);
    console.log("Socket gestartet");
    let activeConnections = {};
    const updateConsole = (...latest) => {
        console.clear();
        console.log("Server läuft: " + ipAddress);
        if (latest.length > 0) {
            console.log(`[${new Date().toLocaleTimeString()}]:`, ...latest);
        }
        Object.entries(activeConnections).forEach(([port, { udpServer, connectedSockets, connectedDevice }]) => {
            const connections = {
                UDP: {
                    connected: udpServer.connected,
                },
                connectedSockets: Object.entries(connectedSockets).map(([deviceID, sockets]) => ({
                    deviceID,
                    socketIDs: sockets
                        .map(socket => socket.id)
                        .join(", "),
                })),
            };
            if (connectedDevice ?? false) {
                connections.UDP.info = connectedDevice;
            }
            console.log(port + ": ", connections);
        });
    };
    updateConsole("Erfolgreich gestartet");
    setInterval(updateConsole, 5000);
    server_socket_1.default.on("connect", (clientSocket) => {
        clientSocket.on("initialize-listener", (deviceID, port) => {
            clientSocket.emit("tell-id", clientSocket.id);
            //Es gibt diesen UDP-Server noch nicht
            if (!activeConnections[port]) {
                activeConnections[port] = {
                    udpServer: new udpserver_1.UdpServer(port),
                    connectedSockets: {
                        [deviceID]: [clientSocket],
                    },
                };
                activeConnections[port].udpServer.on("connect", (data, rinfo) => {
                    activeConnections[port].connectedDevice = rinfo;
                    updateConsole("UDP-Server verbunden - Port: " + port);
                });
                activeConnections[port].udpServer.on("data", (data) => {
                    if (activeConnections[port]) {
                        const socketDevices = Object.values(activeConnections[port].connectedSockets);
                        socketDevices.forEach(device => {
                            device.forEach(socket => {
                                socket.emit("data", data);
                            });
                        });
                    }
                });
                activeConnections[port].udpServer.start();
            }
            else {
                //Es gibt dieses Gerät noch nicht, UDP-Server aber schon
                if (!(activeConnections[port].connectedSockets[deviceID] ?? false)) {
                    activeConnections[port].connectedSockets[deviceID] = [
                        clientSocket,
                    ];
                }
                else {
                    activeConnections[port].connectedSockets[deviceID].push(clientSocket);
                }
            }
            updateConsole(`Socket verbunden: DeviceID: ${deviceID} Port: ${port} SocketID: ${clientSocket.id}`);
            clientSocket.on("disconnect", () => {
                activeConnections[port].connectedSockets[deviceID] =
                    activeConnections[port].connectedSockets[deviceID].filter(socket => socket !== clientSocket);
                if (activeConnections[port].connectedSockets[deviceID]
                    .length === 0) {
                    delete activeConnections[port].connectedSockets[deviceID];
                    if (Object.values(activeConnections[port].connectedSockets).length === 0) {
                        activeConnections[port].udpServer.close();
                        delete activeConnections[port];
                        updateConsole(`Alle Verbindungen von Port ${port} aufgelöst`);
                    }
                    else {
                        updateConsole(`Alle Socket Verbindungen von DeviceID: ${deviceID} Port: ${port} verloren`);
                    }
                }
                else {
                    updateConsole(`Socket Verbindung verloren: DeviceID: ${deviceID} Port: ${port} SocketID: ${clientSocket.id}`);
                }
            });
            clientSocket.on("do", (targetDeviceID, targetSocketID, cmd, data) => {
                console.log(targetSocketID, cmd, data);
                if (deviceID === "MTkzLDE1NCwxMzgsMTcw") {
                    activeConnections[port].connectedSockets[targetDeviceID]
                        .find(socket => socket.id === targetSocketID)
                        .emit("do", cmd, data);
                }
            });
        });
    });
})();
