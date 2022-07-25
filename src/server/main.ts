import http from "http";
import express from "express";
import { Server as SocketIOServer } from "socket.io";
import { PeerbellServer } from "../event typings";
import generateAddress from "../utils/random";
import users from "./users";

const app = express();
const httpServer = http.createServer(app);
const io: PeerbellServer = new SocketIOServer(httpServer);

const addressesInUse: Record<string, Record<number, { name: string, description: string }>> = {};

io.on("connection", socket => {
    console.log("someone connected");
    socket.on("ready", (staticAddress, password, callback) => {
        if (staticAddress && password) {
            if (!(staticAddress in users)) return callback({ error: "wrong user" });
            if (!(users[staticAddress] == password)) return callback({ error: "wrong password" });
            if (addressesInUse[staticAddress]) return callback({ error: "address in use" });

            addressesInUse[staticAddress] = {};
            socket.data.address = staticAddress;
            return callback({ address: staticAddress });
        }
        
        let address = generateAddress();
        while (addressesInUse[address]) address = generateAddress(); // just in case we get unlucky
        
        addressesInUse[address] = {};
        socket.data.address = address;
        return callback({ address: address });
    });

    socket.on("disconnect", reason => {
        socket.data.address && addressesInUse[socket.data.address] && delete addressesInUse[socket.data.address];
    });

    socket.on("get address", callback => {
        callback(socket.data.address);
    });

    socket.on("expose", (port, serviceName = "No name provided.", serviceDescription = "No description provided.", callback) => {
        if (!port || typeof port != "number") return callback(false, "port is not a number");
        if (!socket.data.address) return callback(false, "no address");
        if (addressesInUse[socket.data.address][port]) return callback(false, "port already in use");

        addressesInUse[socket.data.address][port] = { name: serviceName, description: serviceDescription };
        return callback(true);
    });

    socket.on("error", e => console.error("fail", e));
});

app.get("/", (_req, res) => res.send("This is a peerbell server. Peerbell is an open-source alternative to p3 and bell for windows 96 made by Carbon 96."));
httpServer.listen(162, () => console.log("Peerbell online at port 3000!"));