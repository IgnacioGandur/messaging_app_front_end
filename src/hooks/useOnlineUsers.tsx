import { useEffect, useState } from "react";
import socket from "../socket";

export interface OnlineUser {
    userId: number;
    username: string;
    profilePictureUrl: string;
    lastActive: Date;
};

const useOnlineUsers = () => {
    const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
    const [lastSeenUpdated, setLastSeenUpdated] = useState<Record<number, string>>({});

    useEffect(() => {
        socket.on("update_user_list", (data) => {
            setOnlineUsers(data);
        });

        socket.on("user_disconnected", ({ userId, lastActive }) => {
            setLastSeenUpdated(prev => ({
                ...prev,
                [userId]: lastActive
            }));
        });

        return () => {
            socket.off("update_user_list");
            socket.off("user_disconnected");
        };
    }, []);

    return { onlineUsers, lastSeenUpdated };
};

export default useOnlineUsers;
