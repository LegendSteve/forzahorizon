export class EventInterferer {
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
export default EventInterferer;
