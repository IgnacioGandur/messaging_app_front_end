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
import FloatingChats from "../../components/floating-chats/FloatingChats";
import MainSidebar from "../../components/main-sidebar/MainSidebar";
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
            <FloatingChats />
        </div>
    </>
}

export default App;
