import socket from "../../socket";
import styles from "./App.module.css";

// Packages
import { Outlet } from "react-router";
import { useRouteLoaderData } from "react-router";
import { useEffect, useState } from "react";

// Components
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import ServerError from "../../components/server-error/ServerError";
import FloatingChats from "../../components/floating-chats/FloatingChats";
import MainSidebar from "../../components/main-sidebar/MainSidebar";

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

    return <div className={styles["app"]}>
        {loaderData?.error ? <ServerError
            title="Server Error"
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
}

export default App;
