interface ServerToClientEvents {
    a
}

interface ClientToServerEvents {
    ready: (callback: (address: string) => void) => void
}