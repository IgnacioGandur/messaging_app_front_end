import styles from "./Footer.module.css";

const Footer = () => {
    return <footer
        id="footer"
        className={styles["footer"]}
    >
        <p className={styles.initials}>
            <span className={styles.initial}>
                I
            </span>
            <span className={`material-symbols-rounded ${styles.icon}`}>
                crown
            </span>
            <span className={styles.initial}>
                G
            </span>
        </p>
        <p className={styles.details}>
            Created by Ignacio Gandur, 2025.
        </p>
    </footer>
}

export default Footer;
