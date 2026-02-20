import styles from "./JoinGroupButton.module.css";
import { useFetcher } from "react-router";

const JoinGroupButton = ({
    groupId
}: { groupId: number }) => {
    const fetcher = useFetcher({ key: "groups" });
    const joinGroup = (groupId: number) => {
        fetcher.submit(
            {
                intent: "join-group",
                groupId
            },
            {
                method: "POST"
            },
        );
    };

    return <button
        onClick={() => joinGroup(groupId)}
        className={styles.button}
    >
        <span className={`material-symbols-rounded ${styles.icon}`}>
            add
        </span>
        <span className={styles.text}>
            Join group
        </span>
    </button>

};

export default JoinGroupButton;
