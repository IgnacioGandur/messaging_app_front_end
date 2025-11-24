import { useState, useEffect } from "react";
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
            <span className="material-symbols-rounded">
                notifications
            </span>
        </button>
        {(showNotifications && friendshipRequests) && (
            <div className={styles["notifications-list"]}>
                <div className={styles.friendships}>
                    {friendshipRequests.map((f: Friendship) => {
                        return <li
                            key={f.id}
                            className={styles.friendship}
                        >
                            <p className={styles.name}>
                                {f.userA.firstName} {f.userA.lastName}
                            </p>
                            <button
                                onClick={() => rejectFriendship(f.id)}
                            >
                                <span className="material-symbols-rounded">
                                    group_remove
                                </span>
                            </button>
                            <button
                                onClick={() => acceptFriendship(f.id)}
                            >
                                <span className="material-symbols-rounded">
                                    person_heart
                                </span>
                            </button>
                        </li>
                    })}
                </div>
            </div>
        )}
    </div>
}

export default Notifications;
