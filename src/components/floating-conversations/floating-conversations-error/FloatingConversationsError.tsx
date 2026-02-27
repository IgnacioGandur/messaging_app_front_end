import MiniButton from "../mini-button/MiniButton";
import type { Status } from "../useConversations";
import styles from "./FloatingConversationsError.module.css";

interface FloatingConversationsErrorProps {
    setStatus: React.Dispatch<React.SetStateAction<Status>>;
    message: string;
};

const FloatingConversationsError = ({
    setStatus,
    message,
}: FloatingConversationsErrorProps) => {
    return <div className={styles.error}>
        <header className={styles.header}>
            <h3
                className={styles.title}
            >
                Error while getting conversations
            </h3>
            <div className={styles.buttons}>
                <MiniButton
                    icon="close"
                    title="Close conversations"
                    onClick={() => setStatus("hide")}
                />
            </div>
        </header>
        <div className={styles["icon-wrapper"]}>
            <span className={`
                ${styles.icon}
                material-symbols-rounded
            `}>
                power_off
            </span>
        </div>
        <p className={styles.text}>
            {message}
        </p>
    </div>
}

export default FloatingConversationsError;
