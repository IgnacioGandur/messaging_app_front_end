import styles from "./FloatingConversations.module.css";

// Hooks
import useFloatingConversations from "./useFloatingConversations";

// Components
import CurrentFloatingConversation from "./current-floating-conversation/CurrentFloatingConversation";
import FloatingConversationsHidden from "./floating-conversations-hidden/FloatingConversationsHidden";
import FloatingConversationsList from "./floating-conversations-list/FloatingConversationsList";

const FloatingConversations = () => {
    const {
        status,
        setStatus,
        currentConversationId,
        setCurrentConversationId,
        conversations,
        isLoading,
    } = useFloatingConversations();

    return status === "hide" ? (
        <FloatingConversationsHidden
            onClick={() => setStatus("list")}
        />
    ) : status === "list"
        ? <FloatingConversationsList
            setStatus={setStatus}
            setCurrentConversationId={setCurrentConversationId}
            isLoading={isLoading}
            conversations={conversations}
        />
        : currentConversationId
        && (<CurrentFloatingConversation
            className={styles["current-floating-conversation"]}
            setStatus={setStatus}
            conversationId={currentConversationId}
        />)
};

export default FloatingConversations;
