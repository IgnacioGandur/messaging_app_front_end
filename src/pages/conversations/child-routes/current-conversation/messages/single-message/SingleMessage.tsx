import styles from "./SingleMessage.module.css";
import { formatDistanceToNow } from "date-fns";
import type Message from "../../../../../../types/message";
import { useRouteLoaderData } from "react-router";
import type User from "../../../../../../types/user";

interface SingleMessageProps {
    message: Message;
    index: number;
    messages: Message[];
    setTargetMessage: React.Dispatch<React.SetStateAction<number>>;
    toggleDeleteDialog: () => void;
    setCurrentImage: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const SingleMessage = ({
    message,
    index,
    messages,
    setTargetMessage,
    toggleDeleteDialog,
    setCurrentImage
}: SingleMessageProps) => {
    const loggedUser = useRouteLoaderData("root") as {
        success: boolean;
        message: string;
        user: User;
    };
    const loggedUserId = loggedUser.user.id;
    const yourMessage = message.senderId === Number(loggedUserId);
    const lastMessage = messages[index + 1]?.senderId !== message.senderId;
    const hideSender = messages[index - 1]?.senderId === message.senderId;

    return <div
        key={message.id}
        className={`
            ${styles.message}
            ${message.deleted ? styles.deleted : null}
            ${yourMessage ? styles.you : styles.userB}
            ${lastMessage ? styles["last-message"] : ""}
            ${hideSender ? styles["hidden-sender"] : styles["show-sender"]}
        `}
    >
        {hideSender ? (
            <div className={styles.pad}></div>
        ) : (
            <>
                <img
                    src={message.sender.profilePictureUrl}
                    alt={`${message.sender.username}'s username.`}
                    className={styles.ppf}
                />
                <h3 className={styles.name}>
                    {yourMessage ? (
                        "You"
                    ) :
                        `${message.sender.firstName} ${message.sender.lastName}`
                    }
                </h3>
            </>
        )}
        <div
            className={styles["message-wrapper"]}
        >
            <p
                className={styles["message-content"]}
            >
                {message.content}
            </p>
            {message.deleted || !yourMessage ? null : (
                <button
                    onClick={() => {
                        setTargetMessage(message.id);
                        toggleDeleteDialog();
                    }}
                    className={styles.delete}
                >
                    <span className="material-symbols-rounded">
                        delete
                    </span>
                </button>
            )}
            {(message.attachments && !message.deleted) && (
                message.attachments.map((a) => {
                    return a.fileType.includes("image") ? (
                        <div
                            key={a.id + "-" + message.id}
                            className={styles["message-content"]}
                        >
                            <button
                                onClick={() => setCurrentImage(a.fileUrl)}
                                className={styles.image}
                            >
                                <img
                                    style={{ width: "300px" }}
                                    src={a.fileUrl}
                                    alt="Conversation image."
                                    className={styles["image-preview"]}
                                />
                                <span
                                    className={styles.text}
                                >
                                    Click to open
                                </span>
                            </button>
                        </div>
                    ) : (
                        <a
                            key={a.id + "-" + message.id}
                            href={`${a.fileUrl}?download`}
                            className={`${styles.content} ${styles.file}`}
                        >
                            <p className={styles.title}>
                                Attachment
                            </p>
                            <div
                                className={styles.wrapper}
                            >
                                <span className={`material-symbols-rounded ${styles.icon}`}>
                                    file_save
                                </span>
                                <p className={styles.filename}>
                                    {a.fileName}
                                </p>
                            </div>
                        </a>
                    )
                })
            )}
        </div>
        <span className={styles.date}>
            {formatDistanceToNow(message.createdAt, { addSuffix: true })}
        </span>
    </div>
}

export default SingleMessage;
