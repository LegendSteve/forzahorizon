"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventInterferer = void 0;
class EventInterferer {
    events = {};
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [callback];
        }
        else {
            this.events[event].push(callback);
        }
    }
    trigger(event, ...data) {
        const dataArr = Array.from(data);
        this.events[event]?.forEach(callback => callback(...dataArr));
    }
}
exports.EventInterferer = EventInterferer;
exports.default = EventInterferer;
