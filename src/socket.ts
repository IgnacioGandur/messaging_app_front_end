import { io } from "socket.io-client";

const socket = io(String(import.meta.env.VITE_API_BASE), {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    timeout: 20000
});

export default socket;
