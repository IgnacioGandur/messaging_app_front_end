import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import styles from "./Notifications.module.css";
import type Friendship from "../../types/friendship";

const Notifications = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [friendshipRequests, setFriendshipRequests] = useState([]);
    const [fetchErrors, setFetchErrors] = useState(false);

    const toggleNotifications = () => {
        setShowNotifications((prevStatus) => !prevStatus);
    };

    const rejectFriendship = (
        id: number
    ) => {
        const url = import.meta.env.VITE_API_BASE + `/friendships/${id}`;
        const options: RequestInit = {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        };
        fetch(url, options)
            .then((response) => response.json())
            .then((result) => {
                if (result.success) {
                    console.log("friendship rejected");
                }
            })
    };

    const acceptFriendship = (
        id: number
    ) => {
        const url = import.meta.env.VITE_API_BASE + `/friendships/${id}`;
        const options: RequestInit = {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        };

        fetch(url, options)
            .then((response) => response.json())
            .then((result) => {
                if (result.success) {
                    console.log("Friendship established");
                }
            })
    };

    useEffect(() => {
        const getFriendships = async () => {
            const url = import.meta.env.VITE_API_BASE + "/friendships?filter=pending";
            const options: RequestInit = {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const response = await fetch(url, options);
            const result = await response.json();

            if (!result.success) {
                setFetchErrors(true);
            } else {
                setIsLoading(false);
                setFriendshipRequests(result.friendshipRequests);
                setFetchErrors(false);
            }
        };

        getFriendships();
    }, []);

    if (fetchErrors) {
        return <div className={styles["notification-errors"]}>
            <span className="material-symbols-rounded">
                app_badging
            </span>
            <span className="material-symbols-rounded">
                block
            </span>
        </div>
    }

    if (isLoading) {
        return <span className="material-symbols-rounded">
            app_badging
        </span>
    }

    return <div className={styles.notifications}>
        <button
            onClick={toggleNotifications}
            className={styles["toggle-notifications"]}
        >
            <span className={`material-symbols-rounded ${styles.icon}`}>
                group_add
            </span>
            {friendshipRequests.length > 0 && (<div className={styles.requests}>
                <span className={styles.number}>
                    {friendshipRequests.length > 9 ? "+9" : friendshipRequests.length}
                </span>
            </div>)}
        </button>
        {(showNotifications && friendshipRequests) && (
            <div className={styles["friendship-requests"]}>
                <div className={styles.header}>
                    <span className="material-symbols-rounded">
                        diversity_3
                    </span>
                    <h2
                        className={styles.title}
                    >Friendship Requests</h2>
                </div>
                <div className={styles.separator}></div>
                <div className={styles["requests-container"]}>
                    {friendshipRequests.map((f: Friendship) => {
                        return <NavLink
                            to={`/users/${f.userAId}`}
                            key={f.id}
                            className={styles.request}
                        >
                            <img
                                className={styles.ppf}
                                src={f.userA.profilePictureUrl}
                                alt="bla"
                            />
                            <button
                                className={styles["reject-button"]}
                                onClick={() => rejectFriendship(f.id)}
                            >
                                <span className={`material-symbols-rounded ${styles.icon}`}>
                                    close
                                </span>
                                <span className={styles.text}>
                                    Reject
                                </span>
                            </button>
                            <button
                                className={styles["accept-button"]}
                                onClick={() => acceptFriendship(f.id)}
                            >
                                <span className={`material-symbols-rounded ${styles.icon}`}>
                                    check
                                </span>
                                <span className={styles.text}>
                                    Accept
                                </span>
                            </button>
                            <div className={styles.names}>
                                <p className={styles.name}>
                                    <span className={styles["first-name"]}>
                                        {f.userA.firstName}
                                    </span>
                                    <span className={styles["last-name"]}>
                                        {f.userA.lastName}
                                    </span>
                                </p>
                                <p className={styles.username}>
                                    @{f.userA.username}
                                </p>
                            </div>
                        </NavLink>
                    })}
                </div>
            </div>
        )}
    </div>
}

export default Notifications;
