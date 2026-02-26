import styles from "./FloatingConversations.module.css";

import { useRouteLoaderData, NavLink } from "react-router";
import useConversations from "./useConversations";

import FloatingConversationsError from "./floating-conversations-error/FloatingConversationsError";
import FloatingConversationsLoader from "./floating-conversations-loader/FloatingConversationsLoader";
import SingleFloatingConversation from "./single-floating-conversation/SingleFloatingConversation";
import type RootLoaderDataProps from "../../types/rootLoaderData";
import CurrentFloatingConversation from "./current-floating-conversation/CurrentFloatingConversation";
import MiniButton from "./mini-button/MiniButton";

const FloatingConversations = () => {
    const {
        isLoading,
        status,
        setStatus,
        conversations,
        error,
        currentConversationId,
        setCurrentConversationId
    } = useConversations();

    const rootData = useRouteLoaderData("root") as RootLoaderDataProps;

    // Hide the button if the user is not logged or if the user is in the "/conversations"  path.
    if (error) return <FloatingConversationsError message={error} />;

    return status === "hide" ? (
        <button
            title="Last conversations"
            onClick={() => setStatus("list")}
            className={styles["conversations-hidden"]}
        >
            <span className={`material-symbols-rounded ${styles.icon}`}>
                conversation
            </span>
            <div className={styles.separator}></div>
            <span className={styles.text}>
                Conversations
            </span>
        </button>
    ) : status === "list"
        ? (
            <div
                className={styles.conversations}
            >
                {isLoading
                    ? <FloatingConversationsLoader
                        message="Loading conversations..."
                    />
                    : (<>
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
                        {conversations.length === 0 ? (
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
                                    return <SingleFloatingConversation
                                        setStatus={setStatus}
                                        loggedUserId={rootData.user!.id}
                                        key={conversation.id}
                                        setCurrentConversationId={setCurrentConversationId}
                                        conversation={conversation}
                                    />
                                })}
                            </ul>
                        )}
                    </>)
                }
            </div>
        )
        : currentConversationId
        && (<CurrentFloatingConversation
            loggedUserId={rootData.user!.id}
            className={styles["current-floating-conversation"]}
            setStatus={setStatus}
            conversationId={currentConversationId}
        />)
};

export default FloatingConversations;
