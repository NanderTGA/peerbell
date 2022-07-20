import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

io.on("connection", socket => {
    console.log("someone connected");
});

app.get("/", (_req, res) => res.send("This is a peerbell server. Peerbell is an open-source alternative to p3 and bell for windows 96 made by Carbon 96."));
httpServer.listen(3000, () => console.log("Peerbell online at port 3000!"));