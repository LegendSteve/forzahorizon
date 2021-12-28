"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventinterferer_1 = require("./eventinterferer");
const express_1 = __importDefault(require("express"));
class WebServer extends eventinterferer_1.EventInterferer {
    port;
    httpServer;
    app;
    constructor(port = 8000) {
        super();
        this.port = port;
    }
    start() {
        this.app = (0, express_1.default)();
        this.app.use("/", express_1.default.static("website/root"));
        this.app.use("/admin", express_1.default.static("website/admin"));
        this.app.use("/:port(4[0-9]{4})", (req, res, next) => {
            this.trigger("connect", req);
            next();
        });
        this.app.use("/:port(4[0-9]{4})", express_1.default.static("website/id"));
        this.httpServer = this.app.listen(this.port);
    }
}
exports.default = new WebServer();
