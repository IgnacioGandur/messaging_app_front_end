import styles from "./FloatingConversationsError.module.css";

interface FloatingConversationsErrorProps {
    message: string;
};
const FloatingConversationsError = ({
    message,
}: FloatingConversationsErrorProps) => {
    return <div className={styles.error}>
        {message}
    </div>
}

export default FloatingConversationsError;
