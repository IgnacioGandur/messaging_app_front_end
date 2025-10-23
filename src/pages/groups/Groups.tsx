import styles from "./Groups.module.css";
import { useState, type ChangeEvent, type FormEvent, type MouseEvent } from "react";
import type Group from "../../types/group";
import { useLoaderData, useRouteLoaderData, useFetcher } from "react-router";
import InputErrors from "../../components/input-errors/InputErrors";

const Groups = () => {
    const loaderData = useLoaderData();
    const loggedUser = useRouteLoaderData("root");
    const groups: Group[] = loaderData?.groups;
    const fetcher = useFetcher();
    const [groupInfo, setGroupInfo] = useState({
        groupName: "",
    });
    const [currentGroup, setCurrentGroup] = useState<Group | null>(null);

    const handleGroupInfo = (e: ChangeEvent<HTMLInputElement>, field: string) => {
        setGroupInfo((prevInfo) => ({
            ...prevInfo,
            [field]: e.target.value
        }));
    };

    const createGroup = (e: FormEvent) => {
        e.preventDefault();
        fetcher.submit(
            {
                intent: "create-group",
                groupName: groupInfo.groupName
            },
            {
                method: "POST",
            }
        )
    };

    const joinGroup = (e: MouseEvent<HTMLButtonElement>, groupId: number) => {
        e.preventDefault();
        fetcher.submit(
            {
                intent: "join-group",
                groupId
            },
            {
                method: "post"
            },
        );
    };

    return <main className={styles.groups}>
        {(fetcher.state === "submitting" && fetcher.formData!.get("intent") === "create-group") && <p>Creating group...</p>}
        {(fetcher.state === "submitting" && fetcher.formData!.get("intent") === "join-group") && <p>Joining group...</p>}
        {fetcher.data && !fetcher.data?.success ? (<InputErrors
            message={fetcher.data?.message}
            errors={fetcher.data?.errors}
        />) : null}
        {currentGroup && (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2rem",
                    position: "absolute",
                    transform: "translate(-50%,-50%)",
                    top: "50%",
                    left: "50%",
                    width: "450px",
                    border: "2px solid cyan",
                    padding: "2rem"
                }}
                className="current-group"
            >
                <button
                    onClick={() => setCurrentGroup(null)}
                >
                    <span className="material-symbols-rounded">
                        close
                    </span>
                </button>
                <img
                    src={currentGroup.profilePicture}
                    alt="Group's profile picture"
                />
                <h2>
                    {currentGroup.title}
                </h2>
                {(() => {
                    const isParicipant = currentGroup.participants.some(
                        (p) => p.userId === loggedUser.user.id
                    );

                    const isOwner = currentGroup.participants.some(
                        (p) => p.userId === loggedUser.user.id && p.role === "OWNER"
                    )

                    if (isOwner) return <p>Your group.</p>
                    if (isParicipant) return <p>Already a member.</p>

                    return <button onClick={(e) => joinGroup(e, currentGroup.id)}>Join</button>
                })()}
            </div>
        )}
        <header className={styles["create-group"]}>
            <form
                onSubmit={createGroup}
                method="POST"
                className={styles.form}
            >
                <label htmlFor="group-name">
                    Group name
                    <input
                        id="group-name"
                        name="groupName"
                        type="text"
                        value={groupInfo.groupName}
                        onChange={(e) => handleGroupInfo(e, "groupName")}
                    />
                </label>
                <button type="submit">
                    <span className="material-symbols-rounded">
                        group_add
                    </span>
                    <span>
                        Create group
                    </span>
                </button>
            </form>
        </header>
        <section className={styles["groups-container"]}>
            {groups && groups.length === 0 ? (
                <p>There are no groups yet.</p>
            ) : (
                groups.map((group) => {
                    const owner = group.participants.find((c) => c.role === "OWNER");
                    const isOwner = owner!.user.id === loggedUser.user.id;
                    const isParticipant = group.participants.some((p) => p.user.id === loggedUser.user.id);

                    return <button
                        onClick={() => setCurrentGroup(group)}
                        key={group.id}
                        className={styles.group}
                    >
                        <div
                            className={styles.creator}
                        >
                            <img
                                style={{
                                    width: "50px",
                                    height: "50px",
                                }}
                                className={styles.ppf}
                                src={owner!.user.profilePictureUrl}
                                alt={`${owner!.user.firstName} ${owner!.user.lastName}'s profile picture.`}
                            />
                            <p className={styles["group-creator"]}>
                                {owner!.user.firstName} {owner!.user.lastName}
                            </p>
                            <p className={styles["creator-username"]}>
                                @{owner!.user.username}
                            </p>
                            <p className={styles.participants}>
                                Participants in this group: {group.participants.length}
                            </p>
                        </div>
                        <div className={styles.info}>
                            <h2>
                                {group.title}
                            </h2>
                            <p className={styles["creation-date"]}>
                                {String(group.createdAt)}
                            </p>
                        </div>
                        {isOwner ? (
                            <p>Your group.</p>
                        ) : isParticipant ? (
                            <p>Already a member.</p>
                        ) : (
                            null
                        )}
                    </button>
                })
            )}
        </section>
    </main>
}

export default Groups;
