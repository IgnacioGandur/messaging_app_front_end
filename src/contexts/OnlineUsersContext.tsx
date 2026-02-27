import { createContext, useContext } from "react";

export interface OnlineUser {
    userId: number;
    username: string;
    profilePictureUrl: string;
    lastActive: Date;
};

export type LastSeen = Record<number, Date>;

interface OnlineUsersContextType {
    onlineUsers: OnlineUser[];
    lastSeenUpdated: LastSeen;
};

const OnlineUsersContext = createContext<OnlineUsersContextType | null>(null);

export const useOnlineUsersContext = () => {
    const context = useContext(OnlineUsersContext);

    if (!context) {
        throw new Error("useOnlineUsersContext must be used within an OnlineUsersProvider");
    }

    return context;
};

export default OnlineUsersContext;
