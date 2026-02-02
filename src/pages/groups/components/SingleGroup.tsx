import styles from "./SingleGroup.module.css";
import type Group from "../../../types/group";

interface SingleGroupProps {
    group: Group;
    loggedUserId: number;
    joinGroup: (groupId: number) => void;
    leaveGroup: (
        userId: number,
        groupId: number
    ) => void;
}

const SingleGroup = ({
    group,
    loggedUserId,
    joinGroup,
    leaveGroup
}: SingleGroupProps) => {
    const owner = group.participants.find((c) => c.role === "OWNER");
    const isOwner = owner!.user.id === loggedUserId;
    const isParticipant = group.participants.some((p) => p.user.id === loggedUserId);

    return <div
        key={group.id}
        className={styles.group}
    >
        <img
            className={styles["group-ppf"]}
            src={group.profilePicture}
            alt={`${group.title}'s profile picture`}
        />
        <h2
            title={group.title}
            className={styles.title}
        >
            {group.title.length > 30
                ? group.title.slice(0, 29) + "..."
                : group.title}
        </h2>
        <div
            className={styles["group-owner"]}
        >
            <h3
                className={styles.title}
            >
                Group owner
            </h3>
            <div className={styles["user-info"]}>
                <img
                    className={styles.ppf}
                    src={owner!.user.profilePictureUrl}
                    alt={`${owner!.user.firstName} ${owner!.user.lastName}'s profile picture.`}
                />
                <p className={styles["creator-name"]}>
                    {owner!.user.firstName} {owner!.user.lastName}
                </p>
            </div>
        </div>
        <div className={styles.participants}>
            <h3
                className={styles.title}
            >
                Participants ({group.participants.length})
            </h3>
            <div
                className={styles.container}
            >
                {group.participants.slice(0, 8).map((p, i) => {
                    const style: React.CSSProperties = {
                        transform: `translateX(-${7 * i}px)`
                    };

                    if (i === 7) {
                        return <div
                            key="more-button"
                            style={style}
                            className={styles.more}
                        >
                            <span
                                className="material-symbols-rounded"
                            >
                                add
                            </span>
                        </div>
                    }

                    return <img
                        key={p.userId}
                        style={style}
                        className={styles["p-ppf"]}
                        alt={`${p.user.username}'s profile picture.`}
                        src={p.user.profilePictureUrl}
                    />
                })}
            </div>
        </div>
        <div className={`${styles.section} ${styles.description}`}>
            <h3
                className={styles.title}
            >
                Description
            </h3>
            <p className={styles.text}>
                {group.description.length > 100
                    ? group.description.slice(0, 99) + "..."
                    : group.description}
            </p>
        </div>
        {isOwner ?
            null
            : !isParticipant
                ? <button
                    onClick={() => joinGroup(group.id)}
                    className={styles.button}
                >
                    <span className={`material-symbols-rounded ${styles.icon}`}>
                        add
                    </span>
                    <span className={styles.text}>
                        Join group
                    </span>
                </button>
                : <button
                    onClick={() => leaveGroup(loggedUserId, group.id)}
                    className={styles.button}
                >
                    <span className={`material-symbols-rounded ${styles.icon}`}>
                        door_open
                    </span>
                    <span className={styles.text}>
                        Leave group
                    </span>
                </button>
        }
        {(isOwner || isParticipant) && <p
            className={styles.tag}
        >
            <span className={`material-symbols-rounded ${styles.icon}`}>
                {isOwner ? "crown" : "input_circle"}
            </span>
            <span className={styles.text}>
                {isOwner ? "Your group" : "Joined"}
            </span>
        </p>}
    </div>

};

export default SingleGroup;
