import styles from "./FriendshipRequests.module.css";

// Packages
import { NavLink, useFetcher } from "react-router";
import { useOnlineUsersContext } from "../../../contexts/OnlineUsersContext";

// Components
import ActiveIndicator from "../../../mini-components/active-indicator/ActiveIndicator";
import LastActive from "../../../mini-components/last-active/LastActive";
import Tooltip from "../../../pages/dashboard/tooltip/Tooltip";

// Hooks
import useFriendshipRequests from "./useFriendshipRequests";

const FriendshipRequests = () => {
    const fetcher = useFetcher();

    const {
        requests,
        isLoading,
        error,
    } = useFriendshipRequests();

    const { onlineUsers, lastSeenUpdated } = useOnlineUsersContext();

    const handleFriendshipRequest = (
        friendshipId: number,
        status: "ACCEPTED" | "REJECTED",
    ) => {
        fetcher.submit(
            {
                friendshipId,
                status
            },
            {
                action: "/respond-friendship-request",
                method: status === "REJECTED"
                    ? "DELETE"
                    : "PUT",
            }
        );
    };

    return <Tooltip
        indicator={requests?.length || ""}
        className={styles.notifications}
        popoverTarget="friendship-requests"
        anchorName="--requests-list"
        ariaText="Show friendship requests"
        icon="handshake"
        tooltipClassName={styles["tooltip"]}
    >
        {isLoading ? (
            <div className={styles.loader}>
                <header className={styles.header}>
                    <h3
                        className={styles.title}
                    >
                        Friendship requests
                    </h3>
                </header>
                <div className={styles["icon-wrapper"]}>
                    <span className={`
                        material-symbols-rounded
                        ${styles.icon}
                        ${styles.animate}
                    `}>
                        progress_activity
                    </span>
                </div>
                <p className={styles.text}>
                    Getting your friendship requests...
                </p>
            </div>
        ) : (
            (!requests || requests.length === 0) || error ? (
                <div className={styles["no-requests"]}>
                    <header className={styles.header}>
                        <h3
                            className={styles.title}
                        >
                            {error ? "We can't get your friendship requests" : "No requests"}
                        </h3>
                    </header>
                    <div className={styles["icon-wrapper"]}>
                        <span className={`
                        material-symbols-rounded
                        ${styles.icon}
                    `}>
                            {error ? "power_off" : "brightness_empty"}
                        </span>
                    </div>
                    <p className={styles.text}>
                        {error ? error : "You don't have any friendship requests."}
                    </p>
                </div>
            ) : (
                <ul className={styles["requests"]}>
                    <header className={styles.header}>
                        <span className={`
                        ${styles.icon}
                        material-symbols-rounded
                    `}>
                            handshake
                        </span>
                        <h3 className={styles.title}>
                            Friendship requests
                        </h3>
                    </header>
                    <ul className={styles.container}>
                        {requests.map((f) => {
                            const user = f.userA;

                            if (!user) return;

                            const name = user.firstName + " " + user.lastName;
                            const isActive = onlineUsers.some(u => u.userId === user.id);
                            const isRespondingThisRequest = fetcher.state !== "idle"
                                && (fetcher.formData?.get("friendshipId")?.toString() === String(f.id));

                            return isRespondingThisRequest ? (
                                <div
                                    key={f.id}
                                    className={styles["loader-wrapper"]}
                                >
                                    <span className={`
                                            ${styles.icon}
                                            material-symbols-rounded
                                        `}>
                                        progress_activity
                                    </span>
                                </div>
                            ) : (<li
                                key={f.id}
                                className={styles.user}
                            >
                                <NavLink
                                    to={`/users/${user.id}`}
                                    className={styles.link}
                                >
                                    <img
                                        className={styles.ppf}
                                        src={user.profilePictureUrl}
                                        alt={name}
                                    />
                                    <h4 className={styles.name}>
                                        {name}
                                    </h4>
                                    {isActive ? (
                                        <ActiveIndicator
                                            className={styles["last-seen"]}
                                            text="Active"
                                        />
                                    ) : (
                                        <LastActive
                                            className={styles["last-seen"]}
                                            lastActive={lastSeenUpdated[user.id]
                                                || user.lastActive}
                                        />
                                    )}
                                </NavLink>
                                <div className={styles.buttons}>
                                    <button
                                        onClick={() => handleFriendshipRequest(f.id, "REJECTED")}
                                        title="Reject friendship request"
                                        className={styles.button}
                                    >
                                        <span className="material-symbols-rounded">
                                            close
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => handleFriendshipRequest(f.id, "ACCEPTED")}
                                        title="Accept friendship request"
                                        className={styles.button}
                                    >
                                        <span className="material-symbols-rounded">
                                            check
                                        </span>
                                    </button>
                                </div>
                            </li>)
                        })}
                    </ul>
                </ul>
            )
        )}
    </Tooltip>
};

export default FriendshipRequests;

