import { useEffect, useState } from "react";
import socket from "../socket";

export interface OnlineUser {
    userId: number;
    username: string;
    profilePictureUrl: string;
};

const useOnlineUsers = () => {
    const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

    useEffect(() => {
        socket.on("update_user_list", (data) => {
            setOnlineUsers(data);
        });
    }, []);

    return { onlineUsers };
}

export default useOnlineUsers;
