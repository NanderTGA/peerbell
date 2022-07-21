import { Server as SocketIOServer } from "socket.io";

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
export default PeerbellServer;