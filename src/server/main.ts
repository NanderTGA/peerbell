import https from "https";
import express from "express";
import { Server as SocketIOServer } from "socket.io";
import { PeerbellServer, Services, ServerSideSocket } from "../event typings";
import generateAddress, { randomString } from "../utils/random";
import users from "./users";
import { readFileSync } from "fs";

import config from "./config";
config.port = config.port || 1620;

const app = express();
const httpsServer = https.createServer({ // fuck http
    key : readFileSync(config.httpsOptions.key),
    cert: readFileSync(config.httpsOptions.cert),
    ca  : readFileSync(config.httpsOptions.ca)
}, app);

const io: PeerbellServer = new SocketIOServer(httpsServer, {
    cors: {
        origin     : "https://windows96.net",
        credentials: true
    }
});

const services: Services = {};

/** List of all current reqIDs */
const reqs: Record<string, string> = {};

// sockets[peerbellAddress] = socket
const sockets: Record<string, ServerSideSocket> = {};

io.on("connection", socket => {
    console.log("someone connected");
    socket.on("ready", (staticAddress, password, callback) => {
        let address: string;

        if (staticAddress && password) {
            if (!(staticAddress in users)) return callback({ error: "wrong user" });
            if (!(users[staticAddress] == password)) return callback({ error: "wrong password" });
            if (services[staticAddress]) return callback({ error: "address in use" });

            address = staticAddress;
        } else {
            address = generateAddress();
            while (services[address]) address = generateAddress(); // just in case we get unlucky
        }
        
        socket.data.address = address;
        services[address] = {};
        sockets[address] = socket;
        console.log("welcome", address, "from ip", socket.handshake.address);
        return callback({ address: address });
    });

    socket.on("disconnect", reason => {
        console.log("bye bye", socket.data.address);
        if (!socket.data.address) return; // nothing to clean up
        if (services[socket.data.address]) delete services[socket.data.address];
        if (sockets[socket.data.address]) delete sockets[socket.data.address];
    });

    socket.on("get address", callback => callback(socket.data.address) );

    socket.on("expose", (port, serviceName = "No name provided.", serviceDescription = "No description provided.", callback) => {
        if (!port || typeof port != "number") return callback(false, "port is not a number");
        if (!socket.data.address) return callback(false, "no address");
        if (services[socket.data.address][port]) return callback(false, "port already in use" );

        services[socket.data.address][port] = { name: serviceName, description: serviceDescription };
        return callback(true);
    });

    socket.on("get services", callback => callback(services));

    socket.on("error", e => console.error("fail", e));

    socket.on("request", (address, port, data, callback) => {
        if (!socket.data.address) return callback(undefined, "sender has no address");
        if (!address || !services[address]) return callback(undefined, "invalid address");
        if (!port || !services[address][port]) return callback(undefined, "invalid port");

        // generate unique req id
        let reqID = randomString(12);
        while (reqs[reqID]) reqID = randomString(12); // just in case we get unlucky
        // return reqid and add it to reqs
        reqs[reqID] = socket.data.address;
        callback(reqID);

        console.log("sending req to", address);
        
        sockets[address].emit("request", socket.data.address, port, data, reqID);
    });

    socket.on("response", (reqID, data) => {
        console.log("response to request", reqID, "to requester", reqs[reqID]);
        sockets[reqs[reqID]].emit("response", reqID, data);
        delete reqs[reqID];
    });
});

app.get("/", (_req, res) => res.send("This is a peerbell server. Peerbell is an open-source alternative to p3 and bell for windows 96 made by Carbon 96."));
httpsServer.listen(config.port, () => console.log(`Peerbell online at port ${config.port}!`));