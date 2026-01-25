import styles from "./Messages.module.css";
import type Message from "../../../../../types/message";
import { formatDistanceToNow } from "date-fns";
import {
    useRef,
    useLayoutEffect,
    useState,
} from "react";
import { PulseLoader } from "react-spinners";

interface MessagesProps {
    loadOlderMessages: () => void;
    isLoadingOlderMessages: boolean;
    hasMoreMessages: boolean;
    messages: Message[];
    loggedUserId: number;
    handleMessageDeletion: (id: number) => void;
};

const Messages = ({
    loadOlderMessages,
    isLoadingOlderMessages,
    hasMoreMessages,
    messages,
    loggedUserId,
    handleMessageDeletion,
}: MessagesProps) => {
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);
    const anchorRef = useRef<HTMLDivElement | null>(null);

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

    // Handle message deletion confirmation modal/dialog.
    useLayoutEffect(() => {
        if (dialogRef.current && showDeleteDialog) {
            dialogRef.current.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [showDeleteDialog]);

    // Handle images modal/dialog.
    useLayoutEffect(() => {
        if (currentImageRef.current && currentImage) {
            currentImageRef.current.showModal();
        } else {
            currentImageRef.current?.close();
        }
    }, [currentImage]);

    // Make messages container take the available space without surpassing 100vh.
    useLayoutEffect(() => {
        if (!messagesContainerRef.current) return;

        const navbar = document.querySelector("#navbar");
        const groupDetails = document.querySelector("#group-details");
        const userBInfo = document.querySelector("#user-b-info");
        const messageForm = document.querySelector("#message-form");
        const footer = document.querySelector("#footer");

        messagesContainerRef.current.style.height = `
            calc(100vh - (${navbar?.clientHeight}px + ${groupDetails?.clientHeight || userBInfo?.clientHeight}px + ${messageForm?.clientHeight}px + ${footer?.clientHeight}px))
        `;
    }, []);

    // Scroll to the bottom of the messages container when page loads.
    useLayoutEffect(() => {
        if (!anchorRef.current) return;
        anchorRef.current.scrollIntoView({ behavior: "auto" });
    }, []);

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
                            handleMessageDeletion(targetMessage);
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
            className={styles.messages}
        >
            {isLoadingOlderMessages ? (
                <div className={styles["more-messages-loader"]}>
                    <PulseLoader
                        className={styles.loader}
                        color="var(--light-dark-font)"
                        size=".5rem"
                    />
                    <p className={styles.message}>Loading older messages...</p>
                </div>
            ) : hasMoreMessages ? (
                <div className={styles["load-more-messages"]}>
                    <button
                        className={styles.button}
                        onClick={loadOlderMessages}
                    >
                        <span className="material-symbols-rounded">
                            arrow_circle_down
                        </span>
                    </button>
                    <p className={styles.text}>
                        Load more messages
                    </p>
                </div>
            ) : null}
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
            <div ref={anchorRef}></div>
        </section>
    </>
};

export default Messages;
