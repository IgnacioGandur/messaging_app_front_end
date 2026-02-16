import type Friendship from "../../types/friendship";
import styles from "./FriendshipRequestButton.module.css";

interface FriendshipRequestButtonProps {
    isSubmitting: boolean | undefined;
    hasFriendshipRequestFromThisUser: boolean | undefined;
    name: string;
    acceptFriendshipRequest: () => void;
    cancelFriendship: () => void;
    sendFriendshipRequest: () => void;
    friendship: Friendship | undefined;
    style?: React.CSSProperties;
    popoverTargetId?: string;
    anchorName?: string;
}

const FriendshipRequestButton = ({
    isSubmitting,
    hasFriendshipRequestFromThisUser,
    name,
    acceptFriendshipRequest,
    cancelFriendship,
    sendFriendshipRequest,
    friendship,
    style,
    popoverTargetId,
    anchorName
}: FriendshipRequestButtonProps) => {
    return isSubmitting ? (
        <div
            style={style}
            className={styles["friendship-button"]}
        >
            <button
                className={`${styles.button} ${styles.loader}`}
            >
                <span className="material-symbols-rounded">
                    progress_activity
                </span>
            </button>
        </div>
    ) : (
        hasFriendshipRequestFromThisUser ? (
            <div
                style={style}
                className={styles["friendship-button"]}
            >
                <button
                    className={`
                        ${styles.button}
                        ${styles["friendship-request"]}
                    `}
                    popoverTarget={popoverTargetId || "handle-friendship-request"}
                    style={{
                        anchorName,
                    }}
                >
                    <span className={`material-symbols-rounded ${styles.icon}`}>
                        handshake
                    </span>
                </button>
                <p className={styles.tooltip}>
                    Wants to be your friend
                </p>
                <div
                    style={{
                        positionAnchor: anchorName
                    }}
                    popover="auto"
                    id={popoverTargetId || "handle-friendship-request"}
                    className={styles["friendship-request-tooltip"]}
                >
                    <div className={styles["content-wrapper"]}>
                        <h4
                            className={styles.title}
                        >
                            <span className={styles.name}>
                                {name}
                            </span> wants to be your friend!
                        </h4>
                        <div className={styles.option}>
                            <button
                                onClick={acceptFriendshipRequest}
                                className={styles.button}
                            >
                                <span className="material-symbols-rounded">
                                    check
                                </span>
                            </button>
                            <p>Accept</p>
                        </div>
                        <div className={styles.option}>
                            <button
                                onClick={cancelFriendship}
                                className={styles.button}
                            >
                                <span className="material-symbols-rounded">
                                    close
                                </span>
                            </button>
                            <p>Reject</p>
                        </div>
                    </div>
                </div>
            </div>
        ) : friendship
            ? <div
                style={style}
                className={styles["friendship-button"]}
            >
                <button
                    onClick={cancelFriendship}
                    className={styles.button}
                    aria-describedby="remove-friendship-tooltip"
                >
                    <span className={`material-symbols-rounded ${styles.icon}`}>
                        {friendship.status === "PENDING" ? "person_cancel" : "person_remove"}
                    </span>
                </button>
                <p
                    id="remove-friendship-tooltip"
                    role="tooltip"
                    className={styles.tooltip}
                >
                    {friendship.status === "PENDING" ? "Cancel friendship request" : "Remove from friends"}
                </p>
            </div>
            : <div
                style={style}
                className={styles["friendship-button"]}
            >
                <button
                    onClick={sendFriendshipRequest}
                    className={styles.button}
                    aria-labelledby="send-friendship-request-tooltip"
                >
                    <span className={`material-symbols-rounded ${styles.icon}`}>
                        person_add
                    </span>
                </button>
                <p
                    id="send-friendship-request-tooltip"
                    role="tooltip"
                    className={styles.tooltip}
                >
                    Send friend request
                </p>
            </div>
    )
}

export default FriendshipRequestButton;
