import { useFetcher } from "react-router";
import styles from "./LeavePrivateConversationButton.module.css";

const LeavePrivateConversationButton = () => {
    const fetcher = useFetcher();
    const leaveGroup = () => {
        fetcher.submit({
            intent: "leave-private-conversation",
        }, {
            method: "PATCH"
        });
    };

    const isLeavingConversation = fetcher.state !== "idle"
        && fetcher.formData?.get("intent")?.toString() === "leave-private-conversation";

    return <div className={styles["leave-private-conversation"]}>
        <button
            title="Delete conversation?"
            className={styles.button}
            popoverTarget="delete-conversation"
        >
            <span className="material-symbols-rounded">
                delete
            </span>
        </button>
        <div
            id="delete-conversation"
            className={styles.tooltip}
            popover="auto"
        >
            <div className={styles.wrapper}>
                {isLeavingConversation ? (
                    <div className={styles.loader}>
                        <p className={styles.text}>
                            Leaving conversation, please wait...
                        </p>
                        <span className={`material-symbols-rounded ${styles.icon}`}>
                            progress_activity
                        </span>
                    </div>
                ) : (
                    <>
                        <p className={styles.text}>
                            Are you sure you want to delete this conversation?
                        </p>
                        <button
                            onClick={leaveGroup}
                            className={styles.button}
                        >
                            Yes
                        </button>
                    </>
                )}
            </div>
        </div>
    </div>
}

export default LeavePrivateConversationButton;
