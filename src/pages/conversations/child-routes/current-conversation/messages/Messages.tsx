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
                <img
                    className={styles["profile-picture"]}
                    src={message.sender.profilePictureUrl}
                    alt={`${message.sender.username}'s profile picture`}
                />
                <h2 className={styles.name}>
                    {message.sender.firstName} {message.sender.lastName}
                </h2>
                <p className={styles.username}>
                    @{message.sender.username}
                </p>
                {(message.senderId === loggedUserId && !message.deleted) && (
                    <button
                        onClick={() => { deleteMessage(message.id) }}
                    >
                        <span className="material-symbols-rounded">
                            close
                        </span>
                    </button>
                )}
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
                <span className="date">
                    {message.createdAt.toString()}
                </span>
                <p className="content">
                    {message.content}
                </p>
            </div>
        })}
    </section>
};

export default Messages;
