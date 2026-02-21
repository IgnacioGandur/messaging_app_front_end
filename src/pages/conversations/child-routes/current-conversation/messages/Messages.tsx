import styles from "./Messages.module.css";
import {
    useRef,
    useState,
    useEffect,
} from "react";
import { useFetcher } from "react-router";

import { PulseLoader } from "react-spinners";
import ImageViewer from "./image-viewer/ImageViewer";
import SingleMessage from "./single-message/SingleMessage";

import type MessageProps from "../../../../../types/message";

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
    const fetcher = useFetcher({ key: "message-form" });

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

    // Scroll to the anchor when the component loads.
    const anchorRef = useRef<HTMLDivElement | null>(null);

    const scrollAgain = fetcher.formData?.get("intent")?.toString() === "send-message"
        && fetcher.data?.success
        && fetcher.state === "idle";

    // Use the first messages in the conversation for the dependency array.
    const lastMessageId = messages.length > 0 ? messages[messages.length - 1].id : null;

    useEffect(() => {
        if (!lastMessageId || !anchorRef.current) return;

        // Delay the scroll a little bit.
        const timer = setTimeout(() => {
            anchorRef.current?.scrollIntoView({ behavior: "smooth", block: 'end' });
        }, 50);

        return () => clearTimeout(timer);

    }, [lastMessageId, scrollAgain]);

    useEffect(() => {
    }, [messages]);

    return <section
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
                        enable
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
        <div
            ref={anchorRef}
            className={styles.anchor}
        ></div>
    </section>
};

export default Messages;
