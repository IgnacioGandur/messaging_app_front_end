import socket from "../../socket";
import styles from "./App.module.css";

// Packages
import { useRouteLoaderData, Outlet } from "react-router";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

// Components
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import ServerError from "../../components/server-error/ServerError";
import FloatingConversations from "../../components/floating-conversations/FloatingConversations";
import MainSidebar from "../../components/main-sidebar/MainSidebar";
import ManagePageTitles from "./ManagePageTitles";

// Contexts
import OnlineUsersContext from "../../contexts/OnlineUsersContext";
import useOnlineUsers from "../../hooks/useOnlineUsers";

const App = () => {
    const loaderData = useRouteLoaderData("root");
    const [showSidebar, setShowSidebar] = useState(false);
    const { onlineUsers, lastSeenUpdated } = useOnlineUsers();

    const toggleSidebar = () => {
        setShowSidebar((prev) => !prev);
    };

    useEffect(() => {
        if (loaderData.user) {
            const {
                id: userId,
                username,
                profilePictureUrl,
                lastActive,
            } = loaderData.user;

            socket.auth = {
                userId,
                username,
                profilePictureUrl,
                lastActive
            };

            socket.connect();
            return () => {
                socket.disconnect();
            };
        }
    }, [loaderData]);

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
            <FloatingConversations />
        </div>
    </OnlineUsersContext.Provider>
}

export default App;
