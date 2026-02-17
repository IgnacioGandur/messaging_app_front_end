import { Fragment } from "react";
import type Conversation from "../../../types/conversation";
import SingleConversation from "../single-conversation/SingleConversation";
import styles from "./ChatsSidebar.module.css";

interface ChatsSidebarProps {
    conversations: Conversation[];
    loggedUserId: number;
};

const ChatsSidebar = ({
    conversations,
    loggedUserId
}: ChatsSidebarProps) => {
    return <section className={styles["chats-sidebar"]}>
        {conversations && conversations.length === 0 ? (
            <div className={styles["no-conversations"]}>
                <span
                    className={`material-symbols-rounded ${styles.icon}`}
                >
                    chat_dashed
                </span>
                <p
                    className={styles.text}
                >
                    You don't have any conversations yet...
                </p>
            </div>
        ) : (
            conversations.map((conversation) => {
                return <Fragment
                    key={conversation.id}
                >
                    <SingleConversation
                        conversation={conversation}
                        loggedUserId={loggedUserId}
                    />
                    <div className={styles.separator}></div>
                </Fragment>
            })
        )}
    </section>
}

export default ChatsSidebar;
