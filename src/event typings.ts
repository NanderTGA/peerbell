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