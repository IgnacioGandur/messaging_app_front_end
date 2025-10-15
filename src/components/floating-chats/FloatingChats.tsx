import styles from "./FloatingChats.module.css";
import { useState } from "react";
import { useLocation, useRouteLoaderData } from "react-router";

const FloatingChats = () => {
    const [showChats, setShowChats] = useState(false);
    const location = useLocation();
    const rootData = useRouteLoaderData("root");

    const toggleShowChats = () => {
        setShowChats((prevState) => !prevState);
    };

    if (!rootData?.success) {
        return;
    }

    if (location.pathname.match(/conversations/)) {
        return;
    }

    return showChats ? (
        <button onClick={toggleShowChats} className={styles.chats}>
            all chats
        </button>
    ) : (<button onClick={toggleShowChats} className={styles["chats-hidden"]}>
        <span className={`material-symbols-rounded ${styles.icon}`}>
            conversation
        </span>
        <div className={styles.separator}></div>
        <span className={styles.text}>
            Chats
        </span>
    </button>)
}

export default FloatingChats;
