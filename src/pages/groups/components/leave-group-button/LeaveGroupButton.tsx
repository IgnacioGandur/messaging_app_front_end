import styles from "./LeaveGroupButton.module.css";
import { useFetcher } from "react-router";

interface LeaveGroupButtonProps {
    groupId: number;
    loggedUserId: number;
};

const LeaveGroupButton = ({
    groupId,
    loggedUserId
}: LeaveGroupButtonProps) => {
    const fetcher = useFetcher({ key: "groups" });

    const leaveGroup = () => {
        fetcher.submit({
            intent: "leave-group",
            groupId: groupId,
            userId: loggedUserId
        }, {
            method: "DELETE"
        });
    };

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
                    onClick={leaveGroup}
                    className={styles.leave}
                >
                    Yes
                </button>
            </div>
        </div>
    </div>
}

export default LeaveGroupButton;
