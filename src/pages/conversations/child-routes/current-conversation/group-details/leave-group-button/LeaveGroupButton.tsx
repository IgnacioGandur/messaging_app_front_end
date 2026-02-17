import styles from "./LeaveGroupButton.module.css";

interface LeaveGroupButtonProps {
    isLeavingGroup: boolean;
    leaveGroup: () => void;
};

const LeaveGroupButton = ({
    isLeavingGroup,
    leaveGroup
}: LeaveGroupButtonProps) => {
    return <div className={styles["leave-group"]}>
        <button
            title="Leave group?"
            className={styles.button}
            popoverTarget="leave-group"
        >
            <span className="material-symbols-rounded">
                door_open
            </span>
        </button>
        <div
            id="leave-group"
            className={styles.tooltip}
            popover="auto"
        >
            <div
                className={styles.wrapper}
            >
                {isLeavingGroup ? (
                    <div className={styles.loader}>
                        <p className={styles.text}>
                            Leaving group, please wait...
                        </p>
                        <span className={`material-symbols-rounded ${styles.icon}`}>
                            progress_activity
                        </span>
                    </div>
                ) : (
                    <>
                        <p
                            className={styles.text}
                            aria-labelledby="leave-group"
                        >
                            Are you sure you want to leave this group?
                        </p>
                        <div className={styles.buttons}>
                            <button
                                onClick={leaveGroup}
                                className={styles.answer}
                            >
                                Yes
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    </div>
}

export default LeaveGroupButton;
