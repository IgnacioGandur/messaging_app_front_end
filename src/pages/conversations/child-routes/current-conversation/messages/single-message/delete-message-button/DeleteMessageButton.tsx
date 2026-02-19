import type Message from "../../../../../../../types/message";
import type RootLoaderDataProps from "../../../../../../../types/rootLoaderData";
import type { CurrentConversationLoaderData } from "../../../CurrentConversation";
import styles from "./DeleteMessageButton.module.css";
import { useFetcher, useRouteLoaderData } from "react-router";

interface DeleteMessageButtonProps {
    className: string;
    message: Message;
    messageId: number,
};

const DeleteMessageButton = ({
    className,
    message,
    messageId,
}: DeleteMessageButtonProps) => {
    const fetcher = useFetcher();
    const rootData = useRouteLoaderData("root") as RootLoaderDataProps;
    const data = useRouteLoaderData("current-conversation") as CurrentConversationLoaderData;
    const participants = data.conversation.participants;
    const loggedUserId = rootData?.user?.id;

    const messageOwnerAsParticipant = participants.find((p) =>
        p.userId === message.senderId);

    const currentUserAsParticipant = participants.find((p) =>
        p.userId === loggedUserId);

    const isYourMessage = message.senderId === loggedUserId;

    const isDeleted = message.deleted;

    const canDeleteMessage = (isYourMessage && !isDeleted)
        || (currentUserAsParticipant?.role === "OWNER" && !isDeleted)
        || (currentUserAsParticipant?.role === "ADMIN" && !isDeleted)
        && (messageOwnerAsParticipant?.role === "USER" && !isDeleted);

    const deleteMessage = () => {
        fetcher.submit(
            {
                intent: "delete-message",
                messageId,
            },
            {
                method: "DELETE"
            }
        );
    };

    const isDeletingMessage = fetcher.state !== "idle"
        && fetcher.formData?.get("intent") === "delete-message"

    return canDeleteMessage && <div
        className={`
            ${className}
            ${styles["delete-message"]} 
            ${!isYourMessage && styles["not-your-message"]}
        `}
    >
        <button
            className={`
                ${styles.button} 
            `}
            aria-labelledby={`delete-message-${messageId}`}
            popoverTarget={`message-delete-tooltip-${messageId}`}
            style={{
                anchorName: `--message-anchor-${messageId}`
            }}
        >
            <span className="material-symbols-rounded">
                delete
            </span>
        </button>
        <div
            popover="auto"
            id={`message-delete-tooltip-${messageId}`}
            className={styles["message-delete-tooltip"]}
            style={{
                positionAnchor: `--message-anchor-${messageId}`
            }}
        >
            <div className={styles.wrapper}>
                {isDeletingMessage ? (
                    <div className={styles.loader}>
                        <p className={styles.title}>
                            Deleting message, please wait...
                        </p>
                        <span className={`material-symbols-rounded ${styles.icon}`}>
                            progress_activity
                        </span>
                    </div>
                ) : (
                    <>
                        <p
                            className={styles.title}
                            aria-labelledby={`delete-message-${messageId}`}
                        >
                            Are you sure you want to delete this message?
                        </p>
                        <button
                            className={styles.button}
                            onClick={deleteMessage}
                        >
                            Yes
                        </button>
                    </>
                )}
            </div>
        </div>
    </div>
};

export default DeleteMessageButton;
