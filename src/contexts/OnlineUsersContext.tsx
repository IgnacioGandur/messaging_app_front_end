import { createContext } from "react";
import type { OnlineUser } from "../hooks/useOnlineUsers";

const OnlineUsersContext = createContext<OnlineUser[]>([]);

export default OnlineUsersContext;
