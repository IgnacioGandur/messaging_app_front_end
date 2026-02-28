import styles from "./Notification.module.css";

interface NotificationProps {
    message: string;
    icon?: string;
};

const Notification = ({
    message,
    icon = "notifications"
}: NotificationProps) => {
    return <div className={styles.notification}>
        <span className={`material-symbols-rounded ${styles.icon}`}>
            {icon}
        </span>
        <div className={styles.separator}></div>
        <p className={styles.text}>
            {message}
        </p>
    </div>
}

export default Notification;
