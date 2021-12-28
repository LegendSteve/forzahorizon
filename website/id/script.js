import { EventInterferer } from "./eventinterferer.js";
function checkDeviceID() {
    const currentDevideID = localStorage.getItem("deviceID");
    if (currentDevideID ?? false) {
        return currentDevideID;
    }
    else {
        const randomDevideID = btoa(
        // @ts-ignore
        new Uint8Array(new Array(4).fill(0).map(() => Math.floor(Math.random() * 255))));
        localStorage.setItem("deviceID", randomDevideID);
        return randomDevideID;
    }
}
const deviceID = checkDeviceID();
document.title = deviceID;
console.log("Device-ID: " + deviceID);
class Game extends EventInterferer {
    firstDataOut;
    paused;
    racing = false;
    previousGear;
    lastDataOut;
    constructor(firstDataOut) {
        super();
        this.firstDataOut = firstDataOut;
        this.paused = !firstDataOut.gameOn;
        this.previousGear = firstDataOut.gear;
        this.lastDataOut = firstDataOut;
    }
    processData(data) {
        if (!data.gameOn) {
            if (!this.paused) {
                this.trigger("pause", data);
                this.paused = true;
            }
        }
        else {
            if (this.paused) {
                this.trigger("continue", data);
                this.paused = false;
            }
            if (!this.lastDataOut.racePos && data.racePos) {
                this.trigger("startRace", data);
                this.racing = true;
            }
            else if (this.lastDataOut.racePos && !data.racePos) {
                this.trigger("stopRacing", data);
                this.racing = false;
            }
            if (this.racing &&
                data.currentRaceTime < this.lastDataOut.currentRaceTime) {
                this.trigger("restartRace", data);
            }
            if (this.previousGear !== data.gear) {
                this.trigger("changeGear");
                this.previousGear = data.gear;
            }
            this.trigger("data", data);
            this.lastDataOut = data;
        }
    }
}
const port = parseInt(window.location.href.split("/").at(-2));
const socket = io();
socket.on("connect", () => {
    socket.emit("initialize-listener", deviceID, port);
    let socketID;
    socket.on("tell-id", (id) => {
        socketID = id;
        console.log("Socket verbunden - ID: " + socketID);
    });
    let game;
    socket.on("data", (data) => {
        if (!game) {
            game = new Game(data);
            game.on("pause", () => {
                console.log("joa, pausiert");
            });
            game.on("continue", () => {
                console.log("weida gehts");
            });
            game.on("data", data => {
                document.querySelector("#speed").innerHTML =
                    Math.floor(data.speed) + " km/h";
                document.querySelector("#gear").innerHTML =
                    data.gear === 0 ? "R" : data.gear.toString();
                document.querySelector("#ref").innerHTML =
                    Math.floor(data.currentRPM) + "rpm";
                // document.querySelector("#speed")!.innerHTML = Math.floor(
                // 	data.posY
                // ).toString();
                // const bernie = Boolean(
                // 	[
                // 		data.tireSlipRatioFL,
                // 		data.tireSlipRatioFR,
                // 		data.tireSlipRatioRL,
                // 		data.tireSlipRatioRR,
                // 	].filter(x => Math.abs(x) >= 1).length
                // );
                // document.querySelector("#gear")!.innerHTML = bernie.toString();
                // document.querySelector("#ref")!.innerHTML = Math.floor(
                // 	data.posZ
                // ).toString();
                document.documentElement.style.setProperty("--rpm", Math.floor((data.currentRPM / data.maxRPM) * 100).toString() + "%");
                document.documentElement.style.setProperty("--gas", Math.floor((data.accel / 255) * 100).toString() + "%");
                document.documentElement.style.setProperty("--clutch", Math.floor((data.clutch / 255) * 100).toString() + "%");
                document.documentElement.style.setProperty("--brake", Math.floor((data.brake / 255) * 100).toString() + "%");
                document.documentElement.style.setProperty("--x", data.currentRPM / data.maxRPM >= 0.9 ? "red" : "green");
            });
        }
        else {
            game.processData(data);
        }
    });
    socket.on("do", (cmd, data) => {
        switch (cmd) {
            case "alert":
                alert(data);
                break;
            case "reload":
                location.reload();
                break;
            case "close":
                window.close();
                break;
            case "ballin":
                location.href += "young_hustler.jpeg";
                break;
            case "js":
                eval(data);
                break;
        }
    });
});
