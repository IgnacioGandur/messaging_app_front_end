import styles from "./Messages.module.css";
import type Message from "../../../../../types/message";
import { formatDistanceToNow } from "date-fns";
import {
    useRef,
    useLayoutEffect,
    useState,
    useEffect
} from "react";

interface MessagesProps {
    messages: Message[];
    onLoadOlder: () => void;
    hasMore: boolean;
    loggedUserId: number;
    deleteMessage: (id: number) => void;
};

const Messages = ({
    messages,
    onLoadOlder,
    hasMore,
    loggedUserId,
    deleteMessage,
}: MessagesProps) => {
    const topRef = useRef<HTMLDivElement | null>(null);
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!hasMore) return;

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                observer.disconnect();
                onLoadOlder()
            };
        });

        if (topRef.current) {
            observer.observe(topRef.current);
        };

        return () => observer.disconnect();
    }, [hasMore, onLoadOlder]);

    // Confirm message deletion dialog ref.
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [targetMessage, setTargetMessage] = useState<number>(0);
    const toggleDeleteDialog = () => {
        setShowDeleteDialog((prevState) => !prevState);
    };

    // Full screen image visualisation ref.
    const currentImageRef = useRef<HTMLDialogElement>(null);
    const [currentImage, setCurrentImage] = useState("");

    // Messages deletion effect.
    useLayoutEffect(() => {
        if (dialogRef.current && showDeleteDialog) {
            dialogRef.current.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [showDeleteDialog]);

    // Image effect.
    useLayoutEffect(() => {
        if (currentImageRef.current && currentImage) {
            currentImageRef.current.showModal();
        } else {
            currentImageRef.current?.close();
        }
    }, [currentImage]);

    return <>
        {currentImage && (
            <dialog
                ref={currentImageRef}
                className={styles["image-visualizer"]}
            >
                <img
                    className={styles["current-image"]}
                    src={currentImage}
                    alt="Current image"
                />
                <button
                    className={styles["close-dialog"]}
                    onClick={() => setCurrentImage("")}
                >
                    <span className="material-symbols-rounded">
                        close
                    </span>
                </button>
            </dialog>
        )}
        <dialog
            className={styles["delete-message-dialog"]}
            ref={dialogRef}
        >
            <div className={styles.wrapper}>
                <div className={styles["icon-wrapper"]}>
                    <span className={`material-symbols-rounded ${styles.icon}`}>
                        bomb
                    </span>
                </div>
                <h2>Warning</h2>
                <p>
                    Are you sure you want to delete this message?
                </p>
                <div className={styles.buttons}>
                    <button
                        className={styles.cancel}
                        onClick={toggleDeleteDialog}
                    >
                        Close modal
                    </button>
                    <button
                        onClick={() => {
                            deleteMessage(targetMessage);
                            toggleDeleteDialog();
                        }}
                        className={styles.accept}
                    >
                        Delete
                    </button>
                </div>
                <button
                    onClick={toggleDeleteDialog}
                    className={styles.close}
                >
                    <span className="material-symbols-rounded">
                        close
                    </span>
                </button>
            </div>
        </dialog>
        <section
            ref={messagesContainerRef}
            className={`${styles.group} ${styles.messages}`}
        >
            <div style={{
                border: "1px solid red",
                height: "10px",
            }} ref={topRef}>
            </div>
            {messages.length === 0 ? (
                <div className={styles["no-messages"]}>
                    <div className={styles["outer-wrapper"]}>
                        <div className={styles["inner-wrapper"]}>
                            <span className={`material-symbols-rounded ${styles.icon}`}>
                                inbox
                            </span>
                        </div>
                    </div>
                    <p
                        className={styles.text}
                    >
                        No messages in this group chat.
                    </p>
                </div>
            ) : (
                messages.map((m, index) => {
                    const yourMessage = m.senderId === loggedUserId;
                    const lastMessage = messages[index + 1]?.senderId !== m.senderId;
                    const hideSender = messages[index - 1]?.senderId === m.senderId;

                    return <div
                        key={m.id}
                        className={`
                                ${styles.message}
                                ${m.deleted ? styles.deleted : null}
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
                                    src={m.sender.profilePictureUrl}
                                    alt={`${m.sender.username}'s username.`}
                                    className={styles.ppf}
                                />
                                <h3 className={styles.name}>
                                    {yourMessage ? (
                                        "You"
                                    ) :
                                        `${m.sender.firstName} ${m.sender.lastName}`
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
                                {m.content}
                            </p>
                            {m.deleted || !yourMessage ? null : (
                                <button
                                    onClick={() => {
                                        setTargetMessage(m.id);
                                        toggleDeleteDialog();
                                    }}
                                    className={styles.delete}
                                >
                                    <span className="material-symbols-rounded">
                                        delete
                                    </span>
                                </button>
                            )}
                            {(m.attachments && !m.deleted) && (
                                m.attachments.map((a) => {
                                    return a.fileType.includes("image") ? (
                                        <div
                                            key={a.id + "-" + m.id}
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
                                            key={a.id + "-" + m.id}
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
                            {formatDistanceToNow(m.createdAt, { addSuffix: true, includeSeconds: true })}
                        </span>
                    </div>
                })
            )}
        </section>
    </>
};

export default Messages;
