import styles from "./GroupDetails.module.css";
import { useState, useRef, useLayoutEffect } from "react";
import { useRouteLoaderData, useFetcher } from "react-router";
import ParticipantsDialog from "./participants-dialog/ParticipantsDialog";
import InfoDialog from "./info-dialog/InfoDialog";
import type Group from "../../../../../types/group";

interface GroupDetailsProps {
    group: Group;
};

const GroupDetails = ({
    group
}: GroupDetailsProps) => {
    const fetcher = useFetcher();
    const rootLoaderData = useRouteLoaderData("root");

    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const infoDialogRef = useRef<HTMLDialogElement | null>(null);
    const participants = group.participants;

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
    const loggedUserIsAdmin = participants.some((p) => p.role === "ADMIN" && p.userId === rootLoaderData.user.id);

    // Control updatable group info (only for group owner).
    const [showInfo, setShowInfo] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const toggleGroupEdit = () => {
        setIsEditing((prev) => !prev);
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
        <ParticipantsDialog
            dialogRef={dialogRef}
            participants={participants}
            setOpenParticipantId={setOpenParticipantId}
            loggedUserIsAdmin={loggedUserIsAdmin}
            loggedUserIsOwner={loggedUserIsOwner}
            openParticipantId={openParticipantId}
            toggleParticipants={toggleParticipants}
        />
        <InfoDialog
            infoDialogRef={infoDialogRef}
            fetcher={fetcher}
            loggedUserIsOwner={loggedUserIsOwner}
            toggleGroupInfo={toggleGroupInfo}
            group={group}
            isEditing={isEditing}
            toggleGroupEdit={toggleGroupEdit}
        />
        <header
            id="group-details"
            className={styles["group-details"]}
        >
            <button
                onClick={toggleGroupInfo}
                className={styles["ppf-title-description"]}
            >
                <img
                    className={styles.ppf}
                    src={group.profilePicture}
                    alt="Group's profile picture"
                />
                <h2
                    className={styles.title}
                >
                    {group.title}
                </h2>
                <p className={styles.description}>
                    {group.description}
                </p>
            </button>
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
                    {participants.length} {participants.length === 1 ? "Participant" : "Participants"}
                </p>
            </button>
        </header>
    </>
};

export default GroupDetails;
