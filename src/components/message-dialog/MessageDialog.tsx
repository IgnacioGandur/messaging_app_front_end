import { NavLink, useFetcher } from "react-router";
import type User from "../../types/user";
import styles from "./MessageDialog.module.css";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";

interface MessageDialogProps {
    currentTargetUser: User | null;
    setCurrentTargetUser: React.Dispatch<React.SetStateAction<User | null>>;
    showMessageModal: boolean;
    setShowMessageModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const MessageDialog = ({
    currentTargetUser,
    setCurrentTargetUser,
    showMessageModal,
    setShowMessageModal
}: MessageDialogProps) => {
    const fetcher = useFetcher();
    const messageDialogRef = useRef<HTMLDialogElement | null>(null);
    const [message, setMessage] = useState("");

    const startConversation = (e: React.FormEvent<HTMLFormElement>) => {
        if (!currentTargetUser) return;
        e.preventDefault();

        fetcher.submit(
            {
                intent: "send-message",
                message,
                recipientId: currentTargetUser.id
            },
            {
                method: "POST"
            }
        );
    };

    useEffect(() => {
        if (!messageDialogRef.current) return;

        if (showMessageModal) {
            messageDialogRef.current.showModal();
        } else {
            messageDialogRef.current.close();
        }
    }, [showMessageModal]);

    return <dialog
        ref={messageDialogRef}
        className={styles["message-dialog"]}
    >
        <div className={styles.wrapper}>
            <button
                className={styles.close}
                onClick={() => {
                    setMessage("");
                    setShowMessageModal(false);
                    setCurrentTargetUser(null);
                }}
            >
                <span className="material-symbols-rounded">
                    close
                </span>
            </button>
            <h2
                className={styles.title}
            >
                Start a conversation
            </h2>
            {currentTargetUser && (
                <NavLink
                    to={`/users/${currentTargetUser.id}`}
                    className={styles["target-user"]}>
                    <p className={styles.name}>
                        {currentTargetUser?.firstName} {currentTargetUser?.lastName}
                    </p>
                    <p className={styles.username}>
                        @{currentTargetUser?.username}
                    </p>
                    <p className={styles.date}>
                        <span className="material-symbols-rounded">
                            calendar_month
                        </span>
                        <span className={styles.text}>
                            Joined on {format(currentTargetUser?.joinedOn, "MMMM do, yyyy")}
                        </span>
                    </p>
                    <img
                        className={styles.ppf}
                        src={currentTargetUser?.profilePictureUrl}
                        alt={`${currentTargetUser?.username}'s profile picture`}
                    />
                </NavLink>
            )}
            <fetcher.Form
                onSubmit={startConversation}
                method="POST"
                className={styles["message-form"]}
            >
                <p
                    className={styles.title}
                >
                    What do you want to say?
                </p>
                <input
                    className={styles.input}
                    value={message}
                    onChange={((e) => {
                        setMessage(e.target.value);
                    })}
                    type="text"
                    name="message"
                    id="message"
                />
                <button
                    className={styles.button}
                >
                    <span
                        className="material-symbols-rounded"
                    >
                        arrow_upward
                    </span>
                </button>
            </fetcher.Form>
        </div>
    </dialog>
}

export default MessageDialog;
