import { NavLink } from "react-router";
import styles from "./NotificationMessage.module.css";

interface NotificationMessageProps {
    to: string;
    message: string;
    icon?: string;
    name: string;
    profilePictureUrl: string;
    isGroup: boolean;
    senderName?: string;
};

const NotificationMessage = ({
    to,
    name,
    profilePictureUrl,
    message,
    isGroup,
    senderName,
    icon = "notifications"
}: NotificationMessageProps) => {
    return <NavLink
        to={to}
        className={styles["notification-message"]}
    >
        <div className={styles.indicator}></div>
        <div className={styles.content}>
            <img
                src={profilePictureUrl}
                alt={name}
                className={styles.ppf}
            />
            <h4 className={styles.name}>
                {name}
            </h4>
            {isGroup ? (
                <div className={styles["group-message"]}>
                    <span className={styles["sender-name"]}>
                        {senderName}:
                    </span>
                    <p className={styles["message-content"]}>
                        {message}
                    </p>
                </div>
            ) : (
                <p className={styles.message}>
                    {message}
                </p>
            )}
        </div>
    </NavLink >
}

export default NotificationMessage;
