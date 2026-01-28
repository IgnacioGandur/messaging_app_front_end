import styles from "./LoggedUser.module.css";
import { useState, Fragment, useRef, useEffect } from "react";
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
    const optionsRef = useRef<HTMLDivElement | null>(null);
    const [showOptions, setShowOptions] = useState(false);

    const toggleShowOptions = () => {
        setShowOptions((prevState) => !prevState);
    };

    useEffect(() => {
        if (!optionsRef.current) return;

        const handleClick = (e: MouseEvent) => {
            if (showOptions && optionsRef.current) {
                if (!optionsRef.current.contains(e.target as Node)) {
                    setShowOptions(false);
                }
            }
        };

        document.addEventListener("mousedown", handleClick);

        return () => document.removeEventListener("mousedown", handleClick);

    }, [showOptions, optionsRef.current]);

    return <div className={styles["profile-dropdown"]}>
        {showOptions && (
            <div
                ref={optionsRef}
                className={styles.options}
            >
                {links.map((link: Link, index) => {
                    return <Fragment
                        key={link.text}
                    >
                        <NavLink
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
                    </Fragment>
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
