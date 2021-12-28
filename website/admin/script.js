"use strict";
const socket = io();
let sendData;
const deviceID = localStorage.getItem("deviceID") ?? "";
const laptopUID = "MTkzLDE1NCwxMzgsMTcw";
const handyUID = "MTUxLDIzMywyMTMsMTE2";
socket.on("connect", () => {
    console.log("Socket verbunden");
    sendData = (targetDeviceID, targetSocketID, cmd, data) => {
        socket.emit("do", targetDeviceID, targetSocketID, cmd, data);
    };
});
