import logo from "../../../../assets/images/icon.svg";
import styles from "./NoConversationSelected.module.css";
import { NavLink } from "react-router";

const NoConversationSelected = () => {
    return <section className={styles["no-conversation-selected"]}>
        <div className={styles["outer-wrapper"]}>
            <div className={styles.wrapper}>
                <div className={styles["logo-container"]}>
                    <img
                        className={styles.logo}
                        src={logo}
                        alt="Website logo"
                    />
                </div>
            </div>
        </div>
        <h2
            className={styles.message}
        >
            Your messages.
        </h2>
        <p
            className={styles.paragraph}
        >
            <span>
                You can look for somebody to chat with <br />
            </span>
            <NavLink
                className={styles.link}
                to="/users"
            >
                Here
            </NavLink>
        </p>
    </section>
}

export default NoConversationSelected;
