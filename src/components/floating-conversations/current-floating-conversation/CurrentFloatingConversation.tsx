import styles from "./CurrentFloatingConversation.module.css";

// Packages
import { useState } from "react";
import { useFetcher } from "react-router";

// Components
import MiniButton from "../mini-button/MiniButton";
import Header from "../header/Header";

// Hooks
import useFetchCurrentConversation from "./useFetchCurrentConversation";

// Types
import type { Status } from "../useConversations";
import FloatingConversationsLoader from "../floating-conversations-loader/FloatingConversationsLoader";
import FloatingMessages from "./floating-messages/FloatingMessages";
import { NavLink } from "react-router";

interface CurrentFloatingConversationProps {
    loggedUserId: number;
    className: string;
    setStatus: React.Dispatch<React.SetStateAction<Status>>;
    conversationId: number;
};

const CurrentFloatingConversation = ({
    loggedUserId,
    className,
    conversationId,
    setStatus,
}: CurrentFloatingConversationProps) => {
    const fetcher = useFetcher();
    const [message, setMessage] = useState("");

    const {
        isLoading,
        fetchError,
        conversation
    } = useFetchCurrentConversation(conversationId);

    const isGroup = conversation?.isGroup;
    const userB = conversation?.participants.find(p => p.userId !== loggedUserId)?.user;

    const title = isGroup
        ? conversation.title
        : `${userB?.firstName} ${userB?.lastName}`;

    const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetcher.submit(
            {
                conversationId,
                message,
            },
            {
                method: "POST",
                action: "/send-message"
            }
        );
        setMessage("");
    };

    return <div
        className={`
            ${className}
            ${styles["current-conversation"]}
        `}
    >
        {isLoading ? (
            <FloatingConversationsLoader
                message="Loading conversation..."
            />
        ) : (<>
            <header
                className={styles.header}
            >
                <NavLink
                    to={`/conversations/${conversation!.id}`}
                    className={styles.user}
                >
                    <img
                        className={styles.ppf}
                        src={isGroup ? conversation.profilePicture : userB?.profilePictureUrl}
                        alt={title}
                    />
                    <span className={styles.title}>
                        {title}
                    </span>
                    <span className={styles["last-active"]}>
                        01/01/2001
                    </span>
                </NavLink>
                <div className={styles.buttons}>
                    <MiniButton
                        title="Back to conversations"
                        icon="keyboard_return"
                        onClick={() => setStatus("list")}
                    />
                    <MiniButton
                        title="Back to conversations"
                        icon="close"
                        onClick={() => setStatus("hide")}
                    />
                </div>
            </header>
            <FloatingMessages
                loggedUserId={loggedUserId}
                messages={conversation!.messages}
            />
            <fetcher.Form
                method="POST"
                className={styles["message-form"]}
                onSubmit={(e) => {
                    sendMessage(e);
                }}
            >
                <input
                    className={styles.input}
                    id="message"
                    name="message"
                    type="text"
                    value={message}
                    placeholder="Hello dude!"
                    onChange={(e) => setMessage(e.target.value)}
                    required={true}
                />
                <button
                    title="Send message"
                    aria-label="Send message"
                    className={styles["submit-button"]}
                >
                    <span className="material-symbols-rounded">
                        arrow_upward_alt
                    </span>
                </button>
            </fetcher.Form>

        </>)}
    </div>
}

export default CurrentFloatingConversation;
