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
import SingleMessage from "./single-message/SingleMessage";

interface MessagesProps {
    loadOlderMessages: () => void;
    isLoadingOlderMessages: boolean;
    hasMoreMessages: boolean;
    messages: MessageProps[];
};

const Messages = ({
    loadOlderMessages,
    isLoadingOlderMessages,
    hasMoreMessages,
    messages,
}: MessagesProps) => {
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);
    const anchorRef = useRef<HTMLDivElement | null>(null);

    // Full screen image visualisation ref.
    const currentImageRef = useRef<HTMLDialogElement>(null);
    const [currentImage, setCurrentImage] = useState<string | undefined>(undefined);

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
                    setCurrentImage={setCurrentImage}
                />
            })
        )}
        <div ref={anchorRef}></div>
    </section>
};

export default Messages;
