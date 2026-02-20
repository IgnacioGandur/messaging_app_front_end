import styles from "./LeaveGroupButton.module.css";

interface LeaveGroupButtonProps {
    leaveGroup: () => void;
    groupId: number;
};

const LeaveGroupButton = ({
    leaveGroup,
    groupId
}: LeaveGroupButtonProps) => {
    const popoverTarget = `leave-group-tooltip-${groupId}`;
    const anchorName = `--leave-group-anchor-${groupId}`;

    return <div className={styles["leave-group-button"]}>
        <button
            title="Leave group"
            className={styles.button}
            popoverTarget={popoverTarget}
            style={{
                anchorName: anchorName
            }}
        >
            <span className={`material-symbols-rounded ${styles.icon}`}>
                door_open
            </span>
        </button>
        <div
            popover="auto"
            style={{
                positionAnchor: anchorName
            }}
            id={popoverTarget}
            className={styles.tooltip}
        >
            <div className={styles.wrapper}>
                <p
                    className={styles.text}
                >
                    Leave group?
                </p>
                <button
                    className={styles.leave}
                    onClick={leaveGroup}
                >
                    Yes
                </button>
            </div>
        </div>
    </div>
}

export default LeaveGroupButton;
