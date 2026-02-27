import styles from "./FloatingConversationsLoader.module.css";

interface FloatingConversationsLoaderProps {
    message: string;
};

const FloatingConversationsLoader = ({
    message
}: FloatingConversationsLoaderProps) => {
    return <div className={styles.loader}>
        <header className={styles.header}>
            <h3
                className={styles.title}
            >
                {message}
            </h3>
        </header>
        <div className={styles["icon-wrapper"]}>
            <span className={`material-symbols-rounded ${styles.icon}`}>
                progress_activity
            </span>
        </div>
    </div>
}
export default FloatingConversationsLoader;
