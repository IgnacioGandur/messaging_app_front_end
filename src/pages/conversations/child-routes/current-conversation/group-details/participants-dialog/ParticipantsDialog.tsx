import type ParticipantType from "../../../../../../types/participant";
import Participant from "../single-participant/SingleParticipant";
import styles from "./ParticipantsDialog.module.css";

interface ParticipantsDialogProps {
    dialogRef: React.RefObject<HTMLDialogElement | null>;
    participants: ParticipantType[];
    loggedUserIsAdmin: boolean | undefined;
    loggedUserIsOwner: boolean;
    toggleParticipants: () => void;
};

const ParticipantsDialog = ({
    dialogRef,
    participants,
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
                    loggedUserIsAdmin={Boolean(loggedUserIsAdmin)}
                    loggedUserIsOwner={Boolean(loggedUserIsOwner)}
                    participant={p}
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
