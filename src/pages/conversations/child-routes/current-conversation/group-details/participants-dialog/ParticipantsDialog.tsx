import type ParticipantType from "../../../../../../types/participant";
import Participant from "../participant/Participant";
import styles from "./ParticipantsDialog.module.css";

interface ParticipantsDialogProps {
    dialogRef: React.RefObject<HTMLDialogElement | null>;
    participants: ParticipantType[];
    setOpenParticipantId: React.Dispatch<React.SetStateAction<number | null>>;
    openParticipantId: number | null;
    loggedUserIsAdmin: boolean | undefined;
    loggedUserIsOwner: boolean;
    toggleParticipants: () => void;
};

const ParticipantsDialog = ({
    dialogRef,
    participants,
    setOpenParticipantId,
    openParticipantId,
    loggedUserIsAdmin,
    loggedUserIsOwner,
    toggleParticipants
}: ParticipantsDialogProps) => {
    return <dialog
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
};

export default ParticipantsDialog;
