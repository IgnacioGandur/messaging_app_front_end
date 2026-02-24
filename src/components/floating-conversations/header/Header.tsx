import styles from "./Header.module.css";

interface HeaderProps {
    title?: string;
};

const Header = ({
    title,
    children
}: React.PropsWithChildren<HeaderProps>) => {
    return <header className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {children}
    </header>
}

export default Header;
