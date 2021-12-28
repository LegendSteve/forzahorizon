"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerSocket = exports.serverSocket = void 0;
const eventinterferer_1 = require("./eventinterferer");
//Externe:
const socket_io_1 = require("socket.io");
class ServerSocket extends eventinterferer_1.EventInterferer {
    io;
    constructor() {
        super();
    }
    start(server) {
        this.io = new socket_io_1.Server(server);
        this.io.on("connect", socket => {
            this.trigger("connect", socket);
        });
        this.io.on("disconnect", socket => {
            this.trigger("disconnect", socket);
        });
    }
}
exports.ServerSocket = ServerSocket;
const serverSocket = new ServerSocket();
exports.serverSocket = serverSocket;
exports.default = serverSocket;
