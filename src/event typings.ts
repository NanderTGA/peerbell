import { Server as SocketIOServer } from "socket.io";
import { Socket as SocketIOClient } from "socket.io-client";

export interface ServerToClientEvents {
    // nothing yet
}

export interface ClientToServerEvents {
    ready: (staticAddress: string | undefined, password: string | undefined, callback: (data: { error?: "wrong user" | "wrong password" | "address in use", address?: string }) => void) => void
    "get address": (callback: (address: string | undefined) => void) => void
}

export interface InterServerEvents {
    // nothing yet
}

export interface SocketData {
    address: string
}

export type PeerbellServer = SocketIOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export type PeerbellClient = SocketIOClient<ServerToClientEvents, ClientToServerEvents>;
export default PeerbellClient;