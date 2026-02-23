import { NavLink } from "react-router";
import styles from "./NotFoundPage.module.css";
import robot from "../../assets/images/robot.svg";
import blob from "../../assets/images/blob.svg";

const NotFoundPage = () => {
    return <main className={styles["not-found"]}>
        <img
            src={blob}
            alt="Blob"
            className={styles.blob}
        />
        <div className={styles.left}>
            <header className={styles.header}>
                <span
                    className={styles.code}
                >
                    404
                </span>
                <p
                    className={styles.oops}
                >
                    Oops!
                </p>
                <h1
                    className={styles.title}
                >
                    Page Not Found
                </h1>
            </header>
            <p className={styles.para}>
                Seems like the page you are looking for doesn't exist!<br />
                Would you like to go back home?
            </p>
            <NavLink
                to="/"
                className={styles.button}
                aria-label="Go back home"
            >
                <span className={`material-symbols-rounded ${styles.icon}`}>
                    home
                </span>
                <span className={styles.text}>
                    Go home
                </span>
            </NavLink>
        </div>
        <div className={styles.right}>
            <img
                className={styles.robot}
                src={robot}
                alt="Not found!"
            />
        </div>
    </main>
}

export default NotFoundPage;
