import io from "socket.io-client";
import PeerbellClient from "../event typings";

const socket: PeerbellClient = io("http://localhost:3000");

socket.emit("ready", "nandertga.pba", "assword", (data) => {
    if (data.error) console.error(data.error);
    else console.log(data.address);
});