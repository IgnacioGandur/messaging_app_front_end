import styles from "./SingleGroup.module.css";
import { useFetcher } from "react-router";
import type Group from "../../../types/group";
import LeaveGroupButton from "./leave-group-button/LeaveGroupButton";
import JoinGroupButton from "./join-group-button/JoinGroupButton";
import { useRouteLoaderData } from "react-router";
import type RootLoaderDataProps from "../../../types/rootLoaderData";

interface SingleGroupProps {
    group: Group;
}

const SingleGroup = ({
    group,
}: SingleGroupProps) => {
    const fetcher = useFetcher({ key: "groups" });
    const rootLoaderData = useRouteLoaderData("root") as RootLoaderDataProps;
    const loggedUserId = rootLoaderData.user!.id;
    const owner = group.participants.find((c) => c.role === "OWNER");
    const isOwner = owner!.user.id === loggedUserId;
    const isParticipant = group.participants.some((p) => p.user.id === loggedUserId);

    const isLeavingOrJoiningGroup = fetcher.state !== "idle"
        && (fetcher.formData?.get("intent") === "join-group"
            || fetcher.formData?.get("intent") === "leave-group")
        && fetcher.formData?.get("groupId")?.toString() === String(group.id);

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
        {isLeavingOrJoiningGroup ? (
            <div
                className={styles.loader}
            >
                <span
                    className={`material-symbols-rounded ${styles.icon}`}
                >
                    progress_activity
                </span>
            </div>
        ) : (
            <div
                className={styles.wrapper}
            >
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
            </div>
        )}
        {isLeavingOrJoiningGroup || (
            isOwner ?
                null
                : !isParticipant
                    ? <JoinGroupButton
                        groupId={group.id}
                    />
                    : <LeaveGroupButton
                        groupId={group.id}
                        loggedUserId={loggedUserId}
                    />
        )}
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
