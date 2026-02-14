import socket from "../../socket";
import styles from "./App.module.css";

// Packages
import { useRouteLoaderData, Outlet } from "react-router";
import { useEffect, useState } from "react";

// Components
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import ServerError from "../../components/server-error/ServerError";
import FloatingChats from "../../components/floating-chats/FloatingChats";
import MainSidebar from "../../components/main-sidebar/MainSidebar";
import { Helmet } from "react-helmet-async";
import ManagePageTitles from "./ManagePageTitles";


const App = () => {
    const loaderData = useRouteLoaderData("root");
    const [showSidebar, setShowSidebar] = useState(false);

    const toggleSidebar = () => {
        setShowSidebar((prev) => !prev);
    };

    useEffect(() => {
        socket.connect();

        return () => {
            socket.disconnect();
        };
    }, []);

    return <>
        <ManagePageTitles />
        <Helmet>
            <title>Chateá | Messaging App</title>
            <meta name="description" content="A simple messaging app that allows you to chat in group or private conversations with users around the world, for free." />
            <meta name="author" content="Ignacio Gandur" />
        </Helmet>
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
            <FloatingChats />
        </div>
    </>
}

export default App;
