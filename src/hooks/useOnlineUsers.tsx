import { useEffect, useState } from "react";
import socket from "../socket";
import type { OnlineUser, LastSeen } from "../contexts/OnlineUsersContext";

const useOnlineUsers = () => {
    const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
    const [lastSeenUpdated, setLastSeenUpdated] = useState<LastSeen>({});

    useEffect(() => {
        socket.on("update_user_list", (data: OnlineUser[]) => {
            ; // Update online users when user disconnects.
            setOnlineUsers(data)

            // When a user connects, look in the lastSeenUpdated object and if 
            // the user has an entry in the object, delete it.
            setLastSeenUpdated((prev) => {
                const updatedState = { ...prev };
                data.forEach(u => delete updatedState[u.userId]); // Delete the user object using it's key.
                return updatedState;
            })
        });

        socket.on("user_disconnected", (data: { userId: number, lastActive: Date }) => {
            setLastSeenUpdated(prev => ({
                ...prev,
                [data.userId]: data.lastActive,
            }))
        });

        return () => {
            socket.off("update_user_list");
            socket.off("user_disconnected");
        };
    }, []);

    return { onlineUsers, lastSeenUpdated };
};

export default useOnlineUsers;
