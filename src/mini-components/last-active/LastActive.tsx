import { formatDistanceToNow } from "date-fns";
import styles from "./LastActive.module.css";

interface LastActiveProps {
    lastActive: Date | string;
};

const LastActive = ({
    lastActive
}: LastActiveProps) => {
    return <span className={styles["last-active"]}>
        <span className={styles.text}>Last active:</span>
        <div className={styles.date}>
            {formatDistanceToNow(lastActive, { addSuffix: true, includeSeconds: true })}
        </div>
    </span>
}

export default LastActive;
