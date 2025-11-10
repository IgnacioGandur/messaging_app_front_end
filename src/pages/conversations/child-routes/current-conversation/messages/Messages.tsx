import styles from "./Messages.module.css";
import type Message from "../../../../../types/message";
import type Attachment from "../../../../../types/attachment";
import type Participant from "../../../../../types/participant";

type MessagesProps = {
    messages: Message[];
    loggedUserId: number;
    deleteMessage: (id: number) => void;
    participants?: Participant[];
};

const Messages = ({
    messages,
    loggedUserId,
    deleteMessage,
    participants
}: MessagesProps) => {

    const loggedUserAsParticipant = participants?.find((p) => p.userId === loggedUserId);

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
                        <div className={styles["group-status"]}>
                            {(() => {
                                const isOwner = participants?.find((p) => p.role === "OWNER" && p.userId === message.senderId);
                                const isAdmin = participants?.find((p) => p.role === "ADMIN" && p.userId === message.senderId);

                                return <span className="material-symbols-rounded">
                                    {isOwner ? "crown" : isAdmin ? "shield_person" : "person"}
                                </span>
                            })()}
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
                                className={styles.attachment}
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
                    {(() => {
                        const messageSender = participants?.find((p) => p.userId === message.senderId);
                        const isMessageOwner = messageSender?.userId === loggedUserAsParticipant?.userId;
                        const isGroupOwner = loggedUserAsParticipant?.role === "OWNER";
                        const canDeleteMessageAsAdmin = loggedUserAsParticipant?.role === "ADMIN" && messageSender?.role === "USER";

                        return message.deleted
                            ? null
                            : isMessageOwner
                                || isGroupOwner
                                || canDeleteMessageAsAdmin
                                ? <button
                                    className={styles["delete-message"]}
                                    onClick={() => { deleteMessage(message.id) }}
                                >
                                    <span className="material-symbols-rounded">
                                        close
                                    </span>
                                </button>
                                : null
                    })()}
                </div>
            </div>
        })}
    </section>
};

export default Messages;
