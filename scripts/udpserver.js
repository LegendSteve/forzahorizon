"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UdpServer = void 0;
const eventinterferer_1 = require("./eventinterferer");
const dgram_1 = __importDefault(require("dgram"));
class UdpServer extends eventinterferer_1.EventInterferer {
    port;
    socket;
    connected = false;
    constructor(port) {
        super();
        this.port = port;
    }
    start() {
        this.socket = dgram_1.default.createSocket("udp4");
        this.socket.bind(this.port);
        this.socket.on("message", (msg, rinfo) => {
            const data = {
                gameOn: Boolean(msg.readInt32LE(0)),
                timestamp: msg.readUInt32LE(4),
                //rpm
                maxRPM: msg.readFloatLE(8),
                idleRPM: msg.readFloatLE(12),
                currentRPM: msg.readFloatLE(16),
                //accel
                accelX: msg.readFloatLE(20),
                accelY: msg.readFloatLE(24),
                accelZ: msg.readFloatLE(28),
                //vel
                velX: msg.readFloatLE(32),
                velY: msg.readFloatLE(36),
                velZ: msg.readFloatLE(40),
                //angvel
                angX: msg.readFloatLE(44),
                angY: msg.readFloatLE(48),
                angZ: msg.readFloatLE(52),
                //ang
                yaw: msg.readFloatLE(56),
                pitch: msg.readFloatLE(60),
                roll: msg.readFloatLE(64),
                nSuspensionFL: msg.readFloatLE(68),
                nSuspensionFR: msg.readFloatLE(72),
                nSuspensionRL: msg.readFloatLE(76),
                nSuspensionRR: msg.readFloatLE(80),
                tireSlipRatioFL: msg.readFloatLE(84),
                tireSlipRatioFR: msg.readFloatLE(88),
                tireSlipRatioRL: msg.readFloatLE(92),
                tireSlipRatioRR: msg.readFloatLE(96),
                wheelSpeedFL: msg.readFloatLE(100),
                wheelSpeedFR: msg.readFloatLE(104),
                wheelSpeedRL: msg.readFloatLE(108),
                wheelSpeedRR: msg.readFloatLE(112),
                rumbleStripFL: Boolean(msg.readFloatLE(116)),
                rumbleStripFR: Boolean(msg.readFloatLE(120)),
                rumbleStripRL: Boolean(msg.readFloatLE(124)),
                rumbleStripRR: Boolean(msg.readFloatLE(128)),
                puddleDepthFL: msg.readFloatLE(132),
                puddleDepthFR: msg.readFloatLE(136),
                puddleDepthRL: msg.readFloatLE(140),
                puddleDepthRR: msg.readFloatLE(144),
                surfaceRumbleFL: msg.readFloatLE(148),
                surfaceRumbleFR: msg.readFloatLE(152),
                surfaceRumbleRL: msg.readFloatLE(156),
                surfaceRumbleRR: msg.readFloatLE(160),
                tireSlipAngleFL: msg.readFloatLE(164),
                tireSlipAngleFR: msg.readFloatLE(168),
                tireSlipAngleRL: msg.readFloatLE(172),
                tireSlipAngleRR: msg.readFloatLE(176),
                tireSlipCombinedFL: msg.readFloatLE(180),
                tireSlipCombinedFR: msg.readFloatLE(184),
                tireSlipCombinedRL: msg.readFloatLE(188),
                tireSlipCombinedRR: msg.readFloatLE(192),
                aSuspensionFL: msg.readFloatLE(196),
                aSuspensionFR: msg.readFloatLE(200),
                aSuspensionRL: msg.readFloatLE(204),
                aSuspensionRR: msg.readFloatLE(208),
                //ignoring tech stuff i don't care about, skip 144 bytes
                carID: msg.readInt32LE(212),
                carClass: msg.readInt32LE(216),
                carPreform: msg.readInt32LE(220),
                dtType: msg.readInt32LE(224),
                numCyl: msg.readInt32LE(228),
                //v2 info
                //pos
                posX: msg.readFloatLE(244),
                posY: msg.readFloatLE(248),
                posZ: msg.readFloatLE(252),
                //spd
                speed: msg.readFloatLE(256) * 3.6,
                power: msg.readFloatLE(260),
                torque: msg.readFloatLE(264),
                flTemp: msg.readFloatLE(268),
                frTemp: msg.readFloatLE(272),
                blTemp: msg.readFloatLE(276),
                brTemp: msg.readFloatLE(280),
                boost: msg.readFloatLE(284),
                fuel: msg.readFloatLE(288),
                travel: msg.readFloatLE(292),
                bestLap: msg.readFloatLE(296),
                lastLap: msg.readFloatLE(300),
                currentLap: msg.readFloatLE(304),
                currentRaceTime: msg.readFloatLE(308),
                lapNumber: msg.readInt16LE(312),
                racePos: msg.readUInt8(314),
                accel: msg.readUInt8(315),
                brake: msg.readUInt8(316),
                clutch: msg.readUInt8(317),
                handBrake: msg.readUInt8(318),
                gear: msg.readUInt8(319),
                steer: msg.readInt8(320),
                drivingLine: msg.readInt8(321),
                brakeDifference: msg.readInt8(322), //1
            };
            if (!this.connected) {
                this.connected = true;
                this.trigger("connect", data, rinfo);
            }
            else {
                this.trigger("data", data, rinfo);
            }
        });
    }
    close() {
        this.socket?.close();
        this.connected = false;
    }
}
exports.UdpServer = UdpServer;
exports.default = UdpServer;
