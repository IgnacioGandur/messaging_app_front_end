import { createContext, useContext } from "react";
import type { OnlineUser } from "../hooks/useOnlineUsers";

interface OnlineUsersContextType {
    onlineUsers: OnlineUser[];
    lastSeenUpdated: Record<number, string>;
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
