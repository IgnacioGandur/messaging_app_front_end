import styles from "./GroupConversation.module.css";
import { useState, useRef, useLayoutEffect } from "react";
import type ParticipantType from "../../../../../types/participant";
import Participant from "./participant/Participant";
import { useRouteLoaderData, useFetcher, useNavigation, useActionData } from "react-router";
import { format } from "date-fns";
import CustomInput from "../../../../../components/custom-input/CustomInput";
import InputErrors from "../../../../../components/input-errors/InputErrors";

interface GroupConversationProps {
    groupPpf?: string;
    groupTitle?: string;
    participants: ParticipantType[];
    date: Date;
    groupDescription: string;
};

const GroupConversation = ({
    groupPpf,
    groupTitle,
    participants,
    date,
    groupDescription,
}: GroupConversationProps) => {
    const fetcher = useFetcher();
    const navigation = useNavigation();
    const actionData = useActionData();
    const rootLoaderData = useRouteLoaderData("root");

    const dialogRef = useRef<HTMLDialogElement>(null);
    const infoDialogRef = useRef<HTMLDialogElement>(null);

    // Control group participants section.
    const [showParticipants, setShowParticipants] = useState(false);
    const [openParticipantId, setOpenParticipantId] = useState<number | null>(null);

    const toggleParticipants = () => {
        setShowParticipants((prevStatus) => !prevStatus);
    };

    const toggleGroupInfo = () => {
        setShowInfo((prevStatus) => !prevStatus);
    };

    const groupOwner = participants.find((p) => p.role === "OWNER");
    const loggedUserIsOwner = groupOwner?.userId === rootLoaderData?.user?.id;
    const loggedUserIsAdmin = participants.find((p) => p.role === "ADMIN" && p.userId === rootLoaderData.user.id);

    // Control updatable group info (only for group owner).
    const [showInfo, setShowInfo] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedGroup, setUpdatedGroup] = useState({
        ppf: groupPpf,
        title: groupTitle,
        description: groupDescription
    });

    const toggleGroupEdit = () => {
        setIsEditing((prev) => !prev);
    };

    const handleGroupUpdatedFields = (
        field: string,
        value: string,
    ) => {
        setUpdatedGroup((prevFields) => ({
            ...prevFields,
            [field]: value
        }))
    };

    useLayoutEffect(() => {
        if (dialogRef.current && showParticipants) {
            dialogRef.current.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [showParticipants]);

    useLayoutEffect(() => {
        if (infoDialogRef.current && showInfo) {
            infoDialogRef.current?.showModal();
        } else {
            infoDialogRef.current?.close();
        }
    }, [showInfo]);

    return <>
        <dialog
            className={styles["participants-dialog"]}
            ref={dialogRef}
        >
            <div className={styles.container}>
                {participants.map((p) => {
                    return <Participant
                        key={p.userId}
                        isOpen={openParticipantId === p.userId}
                        onToggle={() =>
                            setOpenParticipantId((prev) =>
                                prev === p.userId ? null : p.userId
                            )
                        }
                        onClose={() => setOpenParticipantId(null)}
                        loggedUserIsAdmin={Boolean(loggedUserIsAdmin)}
                        loggedUserIsOwner={Boolean(loggedUserIsOwner)}
                        role={p.role}
                        userId={p.userId}
                        ppf={p.user.profilePictureUrl}
                        name={p.user.firstName + " " + p.user.lastName}
                        username={p.user.username}
                    />
                })}
            </div>
            <button
                onClick={toggleParticipants}
                className={styles["close-dialog"]}
            >
                <span className="material-symbols-rounded">
                    close
                </span>
            </button>
        </dialog>
        <dialog
            ref={infoDialogRef}
            className={styles["info-dialog"]}
        >
            {fetcher.state === "submitting" ? (
                <div className={styles.updating}>
                    <div className={styles["icon-container"]}>
                        <span className="material-symbols-rounded">
                            app_badging
                        </span>
                    </div>
                    <p>
                        Updating group, please wait...
                    </p>
                </div>
            ) : (
                <div className={styles["info-container"]}>
                    {fetcher.data && fetcher.data.success && (
                        <div
                            className={styles["success-update"]}
                        >
                            <span
                                className={`material-symbols-rounded ${styles.icon}`}
                            >
                                check_circle
                            </span>
                            <span
                                className={styles.text}
                            >
                                Group info updated successfully!
                            </span>
                        </div>
                    )}
                    {loggedUserIsOwner && (
                        !isEditing && (
                            <button
                                onClick={toggleGroupEdit}
                                className={styles.edit}
                            >
                                <span className="material-symbols-rounded">
                                    edit
                                </span>
                            </button>
                        )
                    )}
                    <button
                        className={styles.close}
                        onClick={toggleGroupInfo}
                    >
                        <span
                            className="material-symbols-rounded"
                        >
                            close
                        </span>
                    </button>
                    <div className={styles["group-ppf"]}>
                        <div className={styles["outer-wrapper"]}>
                            <div className={styles["inner-wrapper"]}>
                                <img
                                    src={groupPpf}
                                    alt={`${groupTitle}'s profile picture.`}
                                    className={styles.ppf}
                                />
                            </div>
                        </div>
                    </div>
                    {(fetcher.data && !fetcher.data.success && isEditing) && (
                        <InputErrors
                            message={fetcher.data.message}
                            errors={fetcher.data.errors}
                        />
                    )}
                    {isEditing ? (
                        <fetcher.Form
                            method="PATCH"
                            className={styles["edit-form"]}
                        >
                            <input
                                type="hidden"
                                name="intent"
                                value="update-group-info"
                            />
                            <h2
                            >
                                Updating group info
                            </h2>
                            <CustomInput
                                id="edit-ppf"
                                name="ppf"
                                type="url"
                                labelText="Update group's profile picture URL."
                                googleIcon="media_link"
                                value={String(updatedGroup.ppf)}
                                onChange={handleGroupUpdatedFields}
                                placeholder="Group profile picture URL here..."
                                required={false}
                            />
                            <CustomInput
                                id="edit-title"
                                name="title"
                                type="text"
                                labelText="Update group's title"
                                googleIcon="edit_square"
                                value={String(updatedGroup.title)}
                                onChange={handleGroupUpdatedFields}
                                placeholder="Group title here..."
                                required={false}
                            />
                            <CustomInput
                                id="edit-description"
                                name="description"
                                type="text"
                                labelText="Update group's description"
                                googleIcon="edit_note"
                                value={!updatedGroup.description ? "" : String(updatedGroup.description)}
                                onChange={handleGroupUpdatedFields}
                                placeholder="Group title here..."
                                required={false}
                            />
                            <div
                                className={styles.buttons}
                            >
                                <button
                                    type="button"
                                    onClick={toggleGroupEdit}
                                >
                                    Cancel
                                </button>
                                <button
                                >
                                    Update
                                </button>
                            </div>
                        </fetcher.Form>
                    ) : (
                        <>
                            <h2
                            >
                                {groupTitle}
                            </h2>
                            <p
                            >
                                {!groupDescription ? "This group doesn't have a description." : groupDescription}
                            </p>
                            <p
                                className={`${styles["participants-n"]} ${styles.field}`}
                            >
                                <span
                                    className={`material-symbols-rounded ${styles.icon}`}
                                >
                                    groups
                                </span>
                                <span
                                    className={styles.text}
                                >
                                    {participants.length} Participants
                                </span>
                            </p>
                            <p
                                className={`${styles.date} ${styles.field}`}
                            >

                                <span
                                    className={`material-symbols-rounded ${styles.icon}`}
                                >
                                    calendar_month
                                </span>
                                <span
                                    className={styles.text}
                                >
                                    {format(date, "LLLL do, yyyy")}
                                </span>
                            </p>
                        </>
                    )}
                    <div
                        className={styles.separator}
                    >
                    </div>
                    {groupOwner && (
                        <>
                            <p>
                                Group owner
                            </p>
                            <div
                                className={styles["group-owner"]}
                            >
                                <h3
                                    className={styles.name}
                                >
                                    {groupOwner.user.firstName} {groupOwner.user.lastName}
                                </h3>
                                <img
                                    className={styles["owner-ppf"]}
                                    src={groupOwner.user.profilePictureUrl}
                                >
                                </img>
                                <p
                                    className={styles.username}
                                >
                                    @{groupOwner.user.username}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}
        </dialog>
        <section
            className={styles["group-conversation"]}
        >
            <header className={styles["group-info"]}>
                <button
                    onClick={toggleParticipants}
                    className={styles.participants}
                >
                    <div className={styles.container}>
                        {participants.map((p, index) => {
                            return <img
                                key={p.userId}
                                style={{
                                    left: index === 0 ? "" : `-${index * 12}px`
                                }}
                                className={styles["ppf-mini"]}
                                src={p.user.profilePictureUrl}
                                alt={`${p.user.firstName} ${p.user.lastName}'s profile picture.`}
                            />
                        })}
                    </div>
                    <p className={styles["participants-n"]}>
                        {participants.length} {participants.length === 1 ? "Participant" : "Participants"}.
                    </p>
                </button>
                <div className={styles["ppf-title"]}>
                    <img
                        className={styles.ppf}
                        src={groupPpf}
                        alt="Group's profile picture"
                    />
                    <h2
                        className={styles.title}
                    >
                        {groupTitle}
                    </h2>
                </div>
                <button
                    className={styles["toggle-info"]}
                    onClick={toggleGroupInfo}
                >
                    <span className={`material-symbols-rounded ${styles["info-icon"]}`}>
                        info
                    </span>
                </button>
            </header>
        </section>
    </>
};

export default GroupConversation;
