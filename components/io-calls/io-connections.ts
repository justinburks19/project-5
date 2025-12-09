import { io } from 'socket.io-client';

export function Connect() {
    fetch('/api/socket').catch(() => {})

    const socket = io(undefined, { path: '/api/socket' })
    
    return socket;
}


