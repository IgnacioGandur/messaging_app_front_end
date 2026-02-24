import Header from "../header/Header";
import styles from "./FloatingConversationsLoader.module.css";

interface FloatingConversationsLoaderProps {
    message: string;
};

const FloatingConversationsLoader = ({
    message
}: FloatingConversationsLoaderProps) => {
    return <div className={styles.loader}>
        <Header
            title={message}
        />
        <div className={styles["icon-wrapper"]}>
            <span className={`material-symbols-rounded ${styles.icon}`}>
                progress_activity
            </span>
        </div>
    </div>
}
export default FloatingConversationsLoader;
