import styles from "./LoggedUser.module.css";
import { Form } from "react-router";

type LoggedUserProps = {
    user: {
        id: number | string;
        username: string;
        firstName: string | null;
        lastName: string | null;
        profilePictureUrl: string;
    }
};

const LoggedUser = ({ user }: LoggedUserProps) => {
    const popoverName = "options-list";
    return <div className={styles["profile-dropdown"]}>
        <button
            className={styles["show-options"]}
            popoverTarget={popoverName}
        >
            <div className={styles.names}>
                <h3 className={styles.name}>
                    <span className={styles["first-name"]}>
                        {user.firstName}
                    </span>
                    <span className={styles["last-name"]}>
                        {user.lastName}
                    </span>
                </h3>
                <p className={styles.username}>
                    @{user.username}
                </p>
            </div>
            <div
                className={styles["profile-button"]}
            >
                <div className={styles["outer-wrapper"]}>
                    <div className={styles["ppf-wrapper"]}>
                        <img
                            src={user.profilePictureUrl}
                            alt={`${user.username}'s profile picture.`}
                            className={styles["profile-picture"]}
                        />
                    </div>
                </div>
            </div>
        </button>
        <div
            id={popoverName}
            popover="auto"
            className={styles.options}
        >
            <Form
                method="POST"
                action="/logout"
            >
                <button
                    className={styles.option}
                >
                    <span className={`
                        material-symbols-rounded
                        ${styles.icon}
                    `}>
                        logout
                    </span>
                    <span className={styles.text}>
                        Logout
                    </span>
                </button>
            </Form>
        </div>
    </div>
}

export default LoggedUser;
