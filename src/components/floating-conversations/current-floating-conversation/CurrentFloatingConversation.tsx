import styles from "./CurrentFloatingConversation.module.css";

// Packages
import { useState } from "react";
import { useFetcher } from "react-router";

// Components
import MiniButton from "../mini-button/MiniButton";
import ActiveIndicator from "../../../mini-components/active-indicator/ActiveIndicator";
import LastActive from "../../../mini-components/last-active/LastActive";

// Hooks
import useCurrentFloatingConversation from "./useCurrentFloatingConversation";

// Types
import type { Status } from "../useConversations";
import FloatingConversationsLoader from "../floating-conversations-loader/FloatingConversationsLoader";
import FloatingMessages from "./floating-messages/FloatingMessages";
import { NavLink } from "react-router";

// Contexts
import { useOnlineUsersContext } from "../../../contexts/OnlineUsersContext";

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
    const {
        error,
        conversation
    } = useCurrentFloatingConversation(conversationId);

    const { onlineUsers, lastSeenUpdated } = useOnlineUsersContext();

    const fetcher = useFetcher();
    const [message, setMessage] = useState("");

    const isGroup = conversation?.isGroup;
    const userB = conversation?.participants.find(p => p.userId !== loggedUserId)?.user;
    const isUserBOnline = onlineUsers.find(u => u.userId === userB?.id);
    const userBLastActive = userB?.id ? lastSeenUpdated[userB?.id] : undefined;

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

    const isSendingMessage = fetcher.state === "idle";

    if (error) return <div
        className={`
            ${className}
            ${styles["current-conversation"]}
            ${styles["fetch-error"]}
        `}
    >
        <header className={styles.header}>
            <h2>No conversation</h2>
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
        <p className={styles.details}>
            We were not able to get this conversation.
        </p>
        <div className={styles.container}>
            <span className={`material-symbols-rounded ${styles.icon}`}>
                voice_selection_off
            </span>
        </div>
        <p className={styles.error}>
            {error}
        </p>
    </div>

    if (!conversation) return <div
        className={`
            ${className}
            ${styles["current-conversation"]}
        `}
    >
        <FloatingConversationsLoader
            message="Loading conversation..."
        />
    </div>

    return <div
        className={`
            ${className}
            ${styles["current-conversation"]}
        `}
    >
        <header
            className={styles.header}
        >
            <NavLink
                to={`/conversations/${conversation.id}`}
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
                {isUserBOnline ? (
                    <ActiveIndicator
                        text="Active"
                    />
                ) : (
                    isGroup ? (
                        <span
                            className={styles.participants}
                        >
                            {conversation.participants.length} Participants
                        </span>
                    ) : (userB && !isGroup) && (
                        <LastActive
                            lastActive={
                                userBLastActive
                                    ? userBLastActive
                                    : userB.lastActive
                            }
                        />
                    )
                )}
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
            isSendingMessage={isSendingMessage}
            loggedUserId={loggedUserId}
            messages={conversation.messages}
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
    </div>
}

export default CurrentFloatingConversation;
