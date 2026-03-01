import socket from "../../socket";
import styles from "./App.module.css";

// Packages
import { useRouteLoaderData, Outlet } from "react-router";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

// Components
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import ServerError from "../../components/server-error/ServerError";
import FloatingConversations from "../../components/floating-conversations/FloatingConversations";
import MainSidebar from "../../components/main-sidebar/MainSidebar";
import ManagePageTitles from "./ManagePageTitles";
import NotificationMessage from "../../mini-components/notification-message/NotificationMessage";

// Contexts
import OnlineUsersContext from "../../contexts/OnlineUsersContext";
import useOnlineUsers from "../../hooks/useOnlineUsers";
import { useLocation } from "react-router";

// Types
import type Message from "../../types/message";
import type Conversation from "../../types/conversation";

interface MessagePayload extends Message {
    conversationId: number;
    conversation: Conversation;
}

const App = () => {
    const location = useLocation();
    const loaderData = useRouteLoaderData("root");
    const [showSidebar, setShowSidebar] = useState(false);
    const { onlineUsers, lastSeenUpdated } = useOnlineUsers();
    const isInConversationsPath = location.pathname.includes("conversations");
    const showFloatingConversations = loaderData?.success
        && !isInConversationsPath

    const toggleSidebar = () => {
        setShowSidebar((prev) => !prev);
    };

    useEffect(() => {
        if (loaderData.user) {
            const {
                id: userId,
                username,
                profilePictureUrl,
            } = loaderData.user;

            socket.auth = {
                userId,
                username,
                profilePictureUrl,
            };

            socket.connect();

            return () => {
                socket.disconnect();
            };
        }
    }, [loaderData]);

    useEffect(() => {
        const notifyMessage = (payload: MessagePayload) => {
            const userPpf = payload.sender.profilePictureUrl;
            const isGroup = payload.conversation.isGroup;
            const groupTitle = payload.conversation.title;
            const senderName = payload.sender.firstName + " " + payload.sender.lastName;
            const name = (isGroup ? groupTitle : senderName)!;
            const groupPpf = payload.conversation.profilePicture;

            if (!isInConversationsPath) {
                toast.custom(<NotificationMessage
                    to={`/conversations/${payload.conversationId}`}
                    name={name}
                    message={payload.content}
                    profilePictureUrl={(isGroup ? groupPpf : userPpf)!}
                    isGroup={isGroup}
                    senderName={senderName}
                />)
            };
        };

        socket.on("notification:receive_message", notifyMessage);

        return () => {
            socket.off("notification:receive_message", notifyMessage);
        };
    }, [isInConversationsPath]);

    return <OnlineUsersContext.Provider value={{ onlineUsers, lastSeenUpdated }} >
        <Toaster
            position="top-center"
        />
        <ManagePageTitles />
        <div className={styles["app"]}>
            {loaderData?.error ? <ServerError
                message={loaderData?.message}
            /> : null}
            <MainSidebar
                showSidebar={showSidebar}
                toggleSidebar={toggleSidebar}
            />
            <Navbar />
            <div className={styles["outlet-wrapper"]}>
                <Outlet />
            </div>
            <Footer />
            {showFloatingConversations && (
                <FloatingConversations />
            )}
        </div>
    </OnlineUsersContext.Provider>
}

export default App;
