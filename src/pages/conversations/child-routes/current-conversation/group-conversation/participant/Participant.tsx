import { useRouteLoaderData, useFetcher } from "react-router";
import styles from "./Participant.module.css";

interface ParticipantProps {
    isOpen: boolean;
    onToggle: () => void;
    onClose: () => void;
    loggedUserIsOwner: boolean;
    loggedUserIsAdmin: boolean;
    role: "OWNER" | "ADMIN" | "USER";
    userId: number;
    ppf: string;
    name: string;
    username: string;
};

const Participant = ({
    isOpen,
    onToggle,
    onClose,
    loggedUserIsOwner,
    loggedUserIsAdmin,
    role,
    userId,
    ppf,
    name,
    username
}: ParticipantProps) => {
    const fetcher = useFetcher();
    const loaderData = useRouteLoaderData("root");

    const toggleAdminStatus = (
        userId: number,
        role: "ADMIN" | "ROLE",
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

    return <li
        className={styles.participant}
        key={userId}
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
                {role === "OWNER"
                    ? "crown"
                    : role === "ADMIN"
                        ? "shield_person"
                        : "person"
                }
            </span>
        </div>
        <h3
            className={styles.name}
        >
            <span>
                {name}
            </span>
            {loaderData.user.id === userId && (
                <span
                    className={styles.you}
                >
                    (You)
                </span>
            )}
        </h3>
        <p
            className={styles.username}
        >
            @{username}
        </p>
        <div className={styles["options-wrapper"]}>
            {loaderData.user.id === userId || role === "OWNER"
                ? null
                : loggedUserIsOwner || loggedUserIsAdmin ? (
                    <button
                        onClick={onToggle}
                        className={styles["options-button"]}
                    >
                        <span
                            className="material-symbols-rounded"
                        >
                            more_horiz
                        </span>
                    </button>
                )
                    : null}
            {isOpen && (
                loggedUserIsOwner
                    ? (
                        <ul
                            className={styles.options}
                        >
                            {role === "ADMIN"
                                ? (
                                    <button
                                        onClick={onClose}
                                        className={styles.option}
                                    >
                                        <span className="material-symbols-rounded">
                                            remove_moderator
                                        </span>
                                        <span className={styles.text}>
                                            Remove adminship
                                        </span>
                                    </button>
                                )
                                : (
                                    <button
                                        onClick={() => {
                                            toggleAdminStatus(userId, "ADMIN");
                                            onClose();
                                        }}
                                        className={styles.option}
                                    >
                                        <span className="material-symbols-rounded">
                                            add_moderator
                                        </span>
                                        <span className={styles.text}>
                                            Make admin
                                        </span>
                                    </button>

                                )
                            }
                            <button
                                onClick={onClose}
                                className={styles.option}
                            >
                                <span className="material-symbols-rounded">
                                    group_remove
                                </span>
                                <span className={styles.text}>
                                    Remove from group
                                </span>
                            </button>
                        </ul>
                    )
                    : loggedUserIsAdmin ? (
                        <div className={styles.options}>
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
                        </div>
                    )
                        : null
            )}
        </div>
    </li>
};

export default Participant;
