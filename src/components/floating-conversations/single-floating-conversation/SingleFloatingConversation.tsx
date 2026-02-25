import styles from "./SingleFloatingConversation.module.css";
import type Conversation from "../../../types/conversation";
import type { Status } from "../useConversations";
import { formatDistanceToNow } from "date-fns";
import { useOnlineUsersContext } from "../../../contexts/OnlineUsersContext";
import ActiveIndicator from "../../../mini-components/active-indicator/ActiveIndicator";

interface SingleFloatingConversationProps {
    setStatus: React.Dispatch<React.SetStateAction<Status>>;
    setCurrentConversationId: React.Dispatch<React.SetStateAction<number | null>>;
    loggedUserId: number;
    conversation: Conversation;
};

const SingleFloatingConversation = ({
    setStatus,
    setCurrentConversationId,
    loggedUserId,
    conversation
}: SingleFloatingConversationProps) => {
    const isGroup = conversation.isGroup;
    const userB = conversation.participants.find(p => p.userId !== loggedUserId)?.user;
    const lastMesage = conversation.messages[0];
    const { onlineUsers } = useOnlineUsersContext();
    const isuserBOnline = onlineUsers.find(u => u.userId === userB?.id);

    return <button
        onClick={() => {
            setStatus("conversation");
            setCurrentConversationId(conversation.id);
        }}
        className={styles.conversation}
    >
        <h2
            className={styles.title}
        >
            {isGroup
                ? conversation.title
                : `${userB?.firstName} ${userB?.lastName}`}
        </h2>
        <div className={styles["ppf-wrapper"]}>
            {(isuserBOnline && !isGroup) && (
                <ActiveIndicator
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                    }}
                />
            )}
            {isGroup && (
                <span
                    title="Group conversation"
                    className={`
                        ${styles["group-indicator"]} 
                        material-symbols-rounded
                    `}
                >
                    group
                </span>
            )}
            <img
                className={styles.ppf}
                src={isGroup
                    ? conversation.profilePicture
                    : userB?.profilePictureUrl}
                alt={conversation.title || `${userB?.firstName} ${userB?.lastName}`}
            />
        </div>
        <div
            className={styles["last-message"]}
        >
            {lastMesage.senderId === loggedUserId && (
                <span className={styles.you}>
                    You:
                </span>
            )}
            <p className={styles.content}>
                {lastMesage.content}
            </p>
            <span className={styles.date}>
                · {formatDistanceToNow(lastMesage.createdAt, { addSuffix: true })}
            </span>
        </div>
    </button>
};

export default SingleFloatingConversation;
