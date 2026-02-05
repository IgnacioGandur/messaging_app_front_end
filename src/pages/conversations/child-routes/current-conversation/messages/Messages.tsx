import styles from "./Messages.module.css";
import type MessageProps from "../../../../../types/message";
import {
    useRef,
    useLayoutEffect,
    useState,
    useEffect,
} from "react";
import { PulseLoader } from "react-spinners";
import ImageViewer from "./image-viewer/ImageViewer";
import DeleteMessageDialog from "./delete-message-dialog/DeleteMessageDialog";
import SingleMessage from "./single-message/SingleMessage";

interface MessagesProps {
    loadOlderMessages: () => void;
    isLoadingOlderMessages: boolean;
    hasMoreMessages: boolean;
    messages: MessageProps[];
    handleMessageDeletion: (id: number) => void;
};

const Messages = ({
    loadOlderMessages,
    isLoadingOlderMessages,
    hasMoreMessages,
    messages,
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
    const [currentImage, setCurrentImage] = useState<string | undefined>(undefined);

    // Handle message deletion confirmation modal/dialog.
    useLayoutEffect(() => {
        if (dialogRef.current && showDeleteDialog) {
            dialogRef.current.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [showDeleteDialog]);

    // Handle images modal/dialog.
    useEffect(() => {
        if (currentImageRef.current && currentImage) {
            currentImageRef.current.showModal();
        } else {
            currentImageRef.current?.close();
        }
    }, [currentImage]);

    // Scroll to the bottom of the messages container when page loads.
    useLayoutEffect(() => {
        if (!anchorRef.current) return;
        anchorRef.current.scrollIntoView({ behavior: "instant" });
    }, []);

    useEffect(() => {
    }, [messages]);

    return <section
        ref={messagesContainerRef}
        className={styles.messages}
    >
        <ImageViewer
            currentImage={currentImage}
            currentImageDialogRef={currentImageRef}
            setCurrentImage={setCurrentImage}
        />
        <DeleteMessageDialog
            dialogRef={dialogRef}
            targetMessage={targetMessage}
            toggleDeleteDialog={toggleDeleteDialog}
            handleMessageDeletion={handleMessageDeletion}
        />
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
            messages.map((m, i) => {
                return <SingleMessage
                    key={m.id}
                    message={m}
                    index={i}
                    messages={messages}
                    setTargetMessage={setTargetMessage}
                    toggleDeleteDialog={toggleDeleteDialog}
                    setCurrentImage={setCurrentImage}
                />
            })
        )}
        <div ref={anchorRef}></div>
    </section>
};

export default Messages;
