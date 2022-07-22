import { Server as SocketIOServer, Socket as SocketIOClient } from "socket.io";

export interface ServerToClientEvents {
    // nothing yet
}

export interface ClientToServerEvents {
    ready: (callback: (address: string) => void) => void
}

export interface InterServerEvents {
    // nothing yet
}

export interface SocketData {
    address: string
}

export type PeerbellServer = SocketIOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export type PeerbellClient = SocketIOClient<ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData>;
export default PeerbellClient;