import styles from "./FloatingConversationsHidden.module.css";

interface FloatingConversationsHiddenProps {
    onClick: () => void;
};

const FloatingConversationsHidden = ({
    onClick
}: FloatingConversationsHiddenProps) => {
    return <button
        title="Last conversations"
        onClick={onClick}
        className={styles["conversations-hidden"]}
    >
        <span className={`material-symbols-rounded ${styles.icon}`}>
            conversation
        </span>
        <div className={styles.separator}></div>
        <span className={styles.text}>
            Conversations
        </span>
    </button>
};

export default FloatingConversationsHidden;
