import https from "https";
import express from "express";
import { Server as SocketIOServer } from "socket.io";
import { PeerbellServer, Services } from "../event typings";
import generateAddress from "../utils/random";
import users from "./users";
import config from "./config";
import { readFileSync } from "fs";

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

io.on("connection", socket => {
    console.log("someone connected");
    socket.on("ready", (staticAddress, password, callback) => {
        if (staticAddress && password) {
            if (!(staticAddress in users)) return callback({ error: "wrong user" });
            if (!(users[staticAddress] == password)) return callback({ error: "wrong password" });
            if (services[staticAddress]) return callback({ error: "address in use" });

            services[staticAddress] = { id: socket.id };
            socket.data.address = staticAddress;
            console.log(staticAddress, "logged on");
            return callback({ address: staticAddress });
        }
        
        let address = generateAddress();
        while (services[address]) address = generateAddress(); // just in case we get unlucky
        
        services[address] = { id: socket.id };
        socket.data.address = address;
        console.log("welcome", address);
        return callback({ address: address });
    });

    socket.on("disconnect", reason => {
        console.log("bye bye", socket.data.address);
        socket.data.address && services[socket.data.address] && delete services[socket.data.address];
    });

    socket.on("get address", callback => {
        callback(socket.data.address);
    });

    socket.on("expose", (port, serviceName = "No name provided.", serviceDescription = "No description provided.", callback) => {
        if (!port || typeof port != "number") return callback(false, "port is not a number");
        if (!socket.data.address) return callback(false, "no address");
        if (services[socket.data.address][port]) return callback(false, "port already in use" );

        services[socket.data.address][port] = { name: serviceName, description: serviceDescription };
        return callback(true);
    });

    socket.on("get services", callback => callback(services));

    socket.on("error", e => console.error("fail", e));
});

app.get("/", (_req, res) => res.send("This is a peerbell server. Peerbell is an open-source alternative to p3 and bell for windows 96 made by Carbon 96."));
httpsServer.listen(config.port, () => console.log(`Peerbell online at port ${config.port}!`));