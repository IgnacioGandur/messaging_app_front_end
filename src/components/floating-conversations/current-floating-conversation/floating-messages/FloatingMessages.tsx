import { useEffect, useRef } from "react";
import { differenceInHours, format } from "date-fns";
import type Message from "../../../../types/message";
import styles from "./FloatingMessages.module.css";
import { Fragment } from "react/jsx-runtime";

interface FloatingMessagesProps {
    isSendingMessage: boolean;
    loggedUserId: number;
    messages: Message[];
};

const FloatingMessages = ({
    isSendingMessage,
    loggedUserId,
    messages
}: FloatingMessagesProps) => {
    const anchorRef = useRef<HTMLDivElement | null>(null);
    const reversedArray = messages.slice().reverse();

    useEffect(() => {
        if (anchorRef?.current) {
            anchorRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [isSendingMessage]);

    return <div className={styles.messages}>
        {reversedArray.map((m, i) => {
            const previousMessage = reversedArray[i - 1];
            const nextMessage = reversedArray[i + 1];
            const isYourMessage = m.senderId === loggedUserId;

            const showPpf = (!nextMessage
                || nextMessage?.senderId !== m.senderId);

            const previousMsgDate = previousMessage ? previousMessage.createdAt : null;

            const hoursBetween = previousMsgDate
                ? differenceInHours(m.createdAt, previousMsgDate)
                : Infinity;

            // Show date only if message is first message or gap between messages is >= 12 hours.

            const showDate = i === 0 || hoursBetween >= 1;

            return <Fragment
                key={m.id}
            >
                {showDate && (
                    <span className={styles.date}>
                        {format(m.createdAt, "dd/LL/yyyy, hh:mm aa")}
                    </span>
                )}
                <div
                    className={`
                    ${styles.message} 
                    ${isYourMessage
                            ? styles.you
                            : ""}
                `}
                >
                    {!isYourMessage && showPpf ? (
                        <img
                            className={styles.ppf}
                            src={m.sender.profilePictureUrl}
                            alt={m.sender.username}
                        />
                    ) : (
                        !isYourMessage && (
                            <div className={styles.pad}></div>
                        )
                    )}
                    <span
                        className={styles.content}
                    >
                        {m.content}
                    </span>
                </div>
            </Fragment>
        })}
        <div className={styles.anchor} ref={anchorRef}></div>
    </div>

};

export default FloatingMessages;
