import socket from "../../socket";
import styles from "./App.module.css";

// Packages
import { Outlet } from "react-router";
import { useRouteLoaderData } from "react-router";
import { useEffect } from "react";

// Components
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import ServerError from "../../components/server-error/ServerError";
import FloatingChats from "../../components/floating-chats/FloatingChats";

const App = () => {
    const loaderData = useRouteLoaderData("root");

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
        <Navbar />
        <Outlet />
        <Footer />
        <FloatingChats />
    </div>
}

export default App;
