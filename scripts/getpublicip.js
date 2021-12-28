"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
function getPublicIP() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: "api.db-ip.com",
            port: 443,
            path: "/v2/free/self",
            method: "GET",
        };
        const req = https_1.default.request(options, res => {
            res.on("data", data => {
                resolve("http://" + JSON.parse(data).ipAddress);
            });
        });
        req.on("error", error => {
            reject(error);
        });
        req.end();
    });
}
exports.default = getPublicIP;
