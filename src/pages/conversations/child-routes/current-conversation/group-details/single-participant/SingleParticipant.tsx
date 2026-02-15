import { useRouteLoaderData, useFetcher } from "react-router";
import styles from "./SingleParticipant.module.css";
import type Participant from "../../../../../../types/participant";

interface SingleParticipantProps {
    loggedUserIsOwner: boolean;
    loggedUserIsAdmin: boolean;
    participant: Participant;
};

const SinglParticipant = ({
    loggedUserIsOwner,
    loggedUserIsAdmin,
    participant,
}: SingleParticipantProps) => {
    const fetcher = useFetcher();
    const loaderData = useRouteLoaderData("root");

    const role = participant.role;
    const userId = participant.userId;
    const ppf = participant.user.profilePictureUrl;
    const name = participant.user.firstName + " " + participant.user.lastName;
    const username = participant.user.username;

    const isYou = loaderData.user.id === userId;
    const isAdmin = role === "ADMIN";
    const isUser = role === "USER";

    const icon = role === "OWNER"
        ? "crown"
        : role === "ADMIN"
            ? "shield_person"
            : "person";
    const showRole = role !== "USER" && !isYou;

    const toggleAdminStatus = (
        userId: number,
        role: "ADMIN" | "USER",
    ) => {
        fetcher.submit(
            {
                intent: "toggle-admin-status",
                userId,
                role
            },
            {
                method: "POST",
            });
    };

    const removeFromGroup = (
        userId: number,
    ) => {
        fetcher.submit(
            {
                intent: "remove-from-group",
                userId,
            },
            {
                method: "POST"
            }
        );
    };

    const showOptionsButton = !isYou
        && loggedUserIsOwner
        || (loggedUserIsAdmin && isUser);

    const showDeleteOption = loggedUserIsOwner
        || (loggedUserIsAdmin
            && isUser);

    return <li
        key={userId}
        className={styles.participant}
    >
        <div className={styles["ppf-container"]}>
            <img
                className={styles.ppf}
                src={ppf}
                alt={`${name}'s profile picture.`}
            />
            <span
                className={`material-symbols-rounded ${styles.icon}`}
            >
                {icon}
            </span>
        </div>
        <h3
            className={styles.name}
        >
            <span>
                {name}
            </span>
            {isYou && <span
                className={styles.you}
            >
                (You)
            </span>}
            {showRole && <span
                className={styles.role}
            >
                ({role})
            </span>}
        </h3>
        <p
            className={styles.username}
        >
            @{username}
        </p>
        {showOptionsButton && (
            <div
                className={styles["options-wrapper"]}
            >
                <button
                    style={{
                        anchorName: `--anchor-${userId}`
                    }}
                    popoverTarget={`options-tooltip-${userId}`}
                    className={styles.button}
                >
                    <span className="material-symbols-rounded">
                        more_horiz
                    </span>
                </button>
                <div
                    popover="auto"
                    id={`options-tooltip-${userId}`}
                    className={styles["options-popover"]}
                    style={{
                        positionAnchor: `--anchor-${userId}`
                    }}
                >
                    <div className={styles.options}>

                        {loggedUserIsOwner && isUser ? (
                            <button
                                onClick={() => toggleAdminStatus(userId, "ADMIN")}
                                className={styles.option}
                            >
                                <span className="material-symbols-rounded">
                                    add_moderator
                                </span>
                                <span className={styles.text}>
                                    Make admin
                                </span>
                            </button>
                        ) : isAdmin && (
                            <button
                                onClick={() => toggleAdminStatus(userId, "USER")}
                                className={styles.option}
                            >
                                <span className="material-symbols-rounded">
                                    remove_moderator
                                </span>
                                <span className={styles.text}>
                                    Remove adminship
                                </span>
                            </button>
                        )}
                        {showDeleteOption && (
                            <button
                                onClick={() => removeFromGroup(userId)}
                                className={styles.option}
                            >
                                <span className="material-symbols-rounded">
                                    group_remove
                                </span>
                                <span className={styles.text}>
                                    Remove from group
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        )}
    </li>
};

export default SinglParticipant;
