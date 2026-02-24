import { NavLink } from "react-router";
import styles from "./MiniButton.module.css";

interface MiniButtonProps {
    isLink?: boolean;
    to?: string;
    title: string;
    onClick?: () => void;
    icon: string;
};

const MiniButton = ({
    isLink,
    to,
    title,
    onClick,
    icon
}: MiniButtonProps) => {
    return isLink ?
        <NavLink
            to={to!}
            title={title}
            aria-label={title}
            className={styles.button}
        >
            <span className={`material-symbols-rounded ${styles.icon}`}>
                {icon}
            </span>
        </NavLink>
        : <button
            title={title}
            aria-label={title}
            className={styles.button}
            onClick={onClick}
        >
            <span className={`material-symbols-rounded ${styles.icon}`}>
                {icon}
            </span>
        </button>
};

export default MiniButton;
