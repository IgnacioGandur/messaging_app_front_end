import styles from "./CurrentPageHeader.module.css";

interface CurrentPageHeaderProps {
    icon: string;
    text: string;
    altClassName?: string;
}

const CurrentPageHeader = ({
    altClassName,
    children,
    icon,
    text
}: React.PropsWithChildren<CurrentPageHeaderProps>) => {
    return <header
        className={`${styles.header} ${altClassName}`}
    >
        <h2
            className={styles.title}
        >
            <span className={`material-symbols-rounded ${styles.icon}`}>
                {icon}
            </span>
            <span className={styles.text}>
                {text}
            </span>
        </h2>
        {children}
    </header>
}

export default CurrentPageHeader;
