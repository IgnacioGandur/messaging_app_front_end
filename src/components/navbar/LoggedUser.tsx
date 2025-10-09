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
    }
};

const LoggedUser = ({ user }: LoggedUserProps) => {
    const [showOptions, setShowOptions] = useState(false);

    const toggleShowOptions = () => {
        return setShowOptions((prevState) => !prevState);
    };

    return showOptions ? (<button
        onClick={toggleShowOptions}
        className={styles["logged-user"]}
    >
        <h3 className={styles.username}>
            {user.username}
        </h3>
    </button>) : (
        <div className={styles.options}>
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
    )
}

export default LoggedUser;
