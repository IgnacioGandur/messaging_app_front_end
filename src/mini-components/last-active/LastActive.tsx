import { formatDistanceToNow } from "date-fns";
import styles from "./LastActive.module.css";

interface LastActiveProps {
    className?: string;
    lastActive: Date | string;
};

const LastActive = ({
    className,
    lastActive
}: LastActiveProps) => {
    return <span
        className={`
            ${className}
            ${styles["last-active"]}
        `}
    >
        <span className={styles.text}>Last active:</span>
        <p className={styles.date}>
            {formatDistanceToNow(lastActive, { addSuffix: true, includeSeconds: true })}
        </p>
    </span>
}

export default LastActive;
