import styles from "./Messages.module.css";
import type Message from "../../../../../types/message";
import type Attachment from "../../../../../types/attachment";

type MessagesProps = {
    messages: Message[];
    loggedUserId: number;
    deleteMessage: (id: number) => void;
};

const Messages = ({
    messages,
    loggedUserId,
    deleteMessage,
}: MessagesProps) => {
    return <section className={styles.messages}>
        {messages.length === 0 ? (
            <p
                style={{
                    backgroundColor: "cyan",
                    padding: "1.5rem",
                    flex: 1
                }}
                className={styles["no-messages"]}
            >
                No messages in this conversation.
            </p>
        ) : messages.map((message: Message) => {
            return <div
                key={message.id}
                className={`${styles.message} ${message.senderId === loggedUserId ? styles.you : styles.userB}`}
            >
                {message.senderId === loggedUserId ? (
                    <p>
                        You
                    </p>
                ) : (
                    <div className={styles["user-info"]}>
                        <img
                            className={styles["profile-picture"]}
                            src={message.sender.profilePictureUrl}
                            alt={`${message.sender.username}'s profile picture`}
                        />
                        <div className="names">
                            <h2 className={styles.name}>
                                {message.sender.firstName} {message.sender.lastName}
                            </h2>
                            <p className={styles.username}>
                                @{message.sender.username}
                            </p>
                        </div>
                    </div>
                )}
                <div className={styles["message-body"]}>
                    {message.attachments.map((a: Attachment) => {
                        return message.deleted ? (
                            <p
                                key={message.id}
                            >File deleted. </p>
                        ) : a.fileType.includes("image") ? (
                            <img
                                key={a.id}
                                className={`${styles.image} ${styles.attachment}`}
                                src={a.fileUrl}
                                alt="Image"
                            />
                        ) : (
                            <div
                                key={a.id}
                                className={`${styles.attachment}`}
                            >
                                <a
                                    href={`${a.fileUrl}?download`}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="icon"
                                >
                                    <span className="material-symbols-rounded">
                                        file_save
                                    </span>
                                    <p>
                                        {a.fileName}
                                    </p>
                                </a>
                            </div>
                        )
                    })}
                </div>
                <p className="content">
                    {message.content}
                </p>
                <div className={styles["date-and-delete"]}>
                    <span className={styles.date}>
                        {message.createdAt.toString()}
                    </span>
                    {(message.senderId === loggedUserId && !message.deleted) && (
                        <button
                            className={styles["delete-message"]}
                            onClick={() => { deleteMessage(message.id) }}
                        >
                            <span className="material-symbols-rounded">
                                close
                            </span>
                        </button>
                    )}
                </div>
            </div>
        })}
    </section>
};

export default Messages;
