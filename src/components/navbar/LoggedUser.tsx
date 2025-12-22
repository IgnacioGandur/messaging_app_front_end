import styles from "./LoggedUser.module.css";
import { useState } from "react";
import { NavLink } from "react-router";

type Link = {
    to: string;
    text: string;
    icon: string;
};

const links: Link[] = [
    {
        to: "/profile",
        text: "Profile",
        icon: "account_circle"
    },
    {
        to: "/logout",
        text: "Logout",
        icon: "logout"
    }
];

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
    const [showOptions, setShowOptions] = useState(false);

    const toggleShowOptions = () => {
        setShowOptions((prevState) => !prevState);
    };

    return <div className={styles["profile-dropdown"]}>
        {showOptions && (
            <div className={styles.options}>
                {links.map((link: Link, index) => {
                    return <>
                        <NavLink
                            key={link.text}
                            to={link.to}
                            className={styles.option}
                        >
                            <span className={` material-symbols-rounded ${styles.icon} `}>

                                {link.icon}
                            </span>
                            <span className={styles.text}>
                                {link.text}
                            </span>
                        </NavLink>
                        {links.length - 2 === index && <div className={styles.separator}></div>}
                    </>
                })}
            </div>
        )}
        <button
            onClick={toggleShowOptions}
            className={styles.user}
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
    </div>
}

export default LoggedUser;
