import styles from "./FloatingConversationsList.module.css";
import { NavLink } from "react-router";

// Components
import FloatingConversationsError from "../floating-conversations-error/FloatingConversationsError";
import FloatingConversationsLoader from "../floating-conversations-loader/FloatingConversationsLoader";
import SingleFloatingConversation from "../single-floating-conversation/SingleFloatingConversation";
import MiniButton from "../mini-button/MiniButton";

// Hooks
import useFloatingConversations, { type Status } from "../useFloatingConversations";
import { useRouteLoaderData } from "react-router";
import type RootLoaderDataProps from "../../../types/rootLoaderData";
import type Conversation from "../../../types/conversation";

interface FloatingConversationsListProps {
    setCurrentConversationId: React.Dispatch<React.SetStateAction<number | null>>;
    setStatus: React.Dispatch<React.SetStateAction<Status>>;
    isLoading: boolean;
    conversations: Conversation[];
};

const FloatingConversationsList = ({
    setStatus,
    setCurrentConversationId,
    isLoading,
    conversations
}: FloatingConversationsListProps) => {

    const rootData = useRouteLoaderData("root") as RootLoaderDataProps;
    const loggedUserId = rootData?.user?.id;
    const {
        error,
    } = useFloatingConversations();

    if (error) return <FloatingConversationsError
        setStatus={setStatus}
        message={error}
    />;

    return isLoading ? (
        <FloatingConversationsLoader
            message="Loading conversations..."
        />
    ) : (
        <div
            className={styles.conversations}
        >
            <header className={styles.header}>
                <h3>Messages</h3>
                <div className={styles.buttons}>
                    <MiniButton
                        isLink={true}
                        to="/conversations"
                        title="Go to the conversations page"
                        icon="expand_content"
                    />
                    <MiniButton
                        title="Close conversation"
                        onClick={() => setStatus("hide")}
                        icon="close"
                    />
                </div>
            </header>
            {!isLoading && conversations.length === 0 ? (
                <div className={styles["empty-conversations"]}>
                    <h3>You don't have conversations</h3>
                    <span className={`
                                    material-symbols-rounded
                                    ${styles.icon}
                                `}>
                        inbox
                    </span>
                    <p className={styles.text}>
                        You can look for users to chat with <NavLink to="/users">here!</NavLink>
                    </p>
                </div>
            ) : (
                <ul className={styles.container}>
                    {conversations.map((conversation) => {
                        return loggedUserId && <SingleFloatingConversation
                            key={conversation.id}
                            loggedUserId={loggedUserId}
                            setStatus={setStatus}
                            setCurrentConversationId={setCurrentConversationId}
                            conversation={conversation}
                        />
                    })}
                </ul>
            )}
        </div>
    )
};

export default FloatingConversationsList;
