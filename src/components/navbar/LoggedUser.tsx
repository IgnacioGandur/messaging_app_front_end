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
        to: "/logout",
        text: "Logout",
        icon: "logout"
    },
    {
        to: "/profile",
        text: "Profile",
        icon: "account_circle"
    },
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
        return setShowOptions((prevState) => !prevState);
    };

    return showOptions ? (
        <div className={styles.options}>
            <div className={styles["user-info"]}>
                <img
                    src={user.profilePictureUrl}
                    alt={`${user.username}'s profile picture.`}
                    className={styles["profile-picture"]}
                />
                <div className={styles.names}>
                    <h3 className={styles.name}>
                        {user.firstName} {user.lastName}
                    </h3>
                    <p className={styles.username}>
                        {user.username}
                    </p>
                </div>
            </div>
            <button
                className={styles.option}
                onClick={toggleShowOptions}
            >
                Hide
            </button>
            {links.map((link: Link) => {
                return <NavLink
                    key={link.text}
                    to={link.to}
                    className={styles.option}
                >
                    {link.text}
                </NavLink>
            })}
        </div>
    ) : (<button
        onClick={toggleShowOptions}
        className={styles["logged-user"]}
    >
        <div className={styles["user-info"]}>
            <img
                src={user.profilePictureUrl}
                alt={`${user.username}'s profile picture.`}
                className={styles["profile-picture"]}
            />
            <div className={styles.names}>
                <h3 className={styles.name}>
                    {user.firstName} {user.lastName}
                </h3>
                <p className={styles.username}>
                    {user.username}
                </p>
            </div>
        </div>
    </button>)
}

export default LoggedUser;
