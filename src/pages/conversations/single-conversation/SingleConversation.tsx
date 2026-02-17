import styles from "./SingleConversation.module.css";
import deletedUserImage from "../../../assets/images/deleted-user.png";

// Packages
import { NavLink } from "react-router";
import { formatDistanceToNow } from "date-fns";

// Types
import type User from "../../../types/user";
import type Conversation from "../../../types/conversation";

interface SingleConversationProps {
    conversation: Conversation;
    loggedUserId: number;
};

const SingleConversation = ({
    conversation,
    loggedUserId
}: SingleConversationProps) => {
    const isGroup = conversation.isGroup;
    const hasNoMessages = conversation.messages.length === 0;

    return <NavLink
        viewTransition
        key={conversation.id}
        to={`/conversations/${conversation.id}`}
        className={({ isActive }) =>
            isActive ? `
                ${styles.active} 
                ${styles.conversation}
                ${isGroup && styles.group}
            ` : `${styles.conversation} ${isGroup && styles.group}`
        }
    >
        {({ isPending }) => (
            isPending ? (
                <div className={styles.loader}>
                    <span className="material-symbols-rounded">
                        progress_activity
                    </span>
                </div>
            ) : (
                <>
                    {(() => {
                        {/* If user deleted his account use a fake profile. */ }
                        const user = conversation.participants.find((p) => p.userId !== loggedUserId) || {
                            user: {
                                firstName: "Deleted",
                                lastName: "User",
                                username: "deleted_user",
                                profilePictureUrl: deletedUserImage,
                                id: 0,
                                joinedOn: new Date(),
                            }
                        } as { user: User };

                        const title = isGroup
                            ? conversation.title
                            : user?.user.firstName + " " + user?.user.lastName;

                        return <>
                            <h2
                                className={styles.name}
                            >
                                {title!.length > 35
                                    ? title!.slice(0, 34) + "..."
                                    : title}
                            </h2>
                            {conversation.isGroup
                                ? (
                                    <div className={styles["group-ppf-container"]}>
                                        <img
                                            className={styles.ppf}
                                            src={conversation.profilePicture}
                                            alt={`${conversation.title}'s group profile picture.`}
                                        />
                                        <span
                                            title="Group conversation"
                                            className={`material-symbols-rounded ${styles["group-icon"]}`}
                                        >
                                            group
                                        </span>
                                    </div>
                                ) : (
                                    <img
                                        className={styles.ppf}
                                        src={user?.user.profilePictureUrl}
                                        alt={`${user?.user.firstName} ${user?.user.lastName}'s profile picture.`}
                                    />
                                )}
                        </>
                    })()}
                    <p className={styles["last-message"]}>
                        <span className={styles.you}>
                            {conversation.messages[0]?.senderId === loggedUserId && "You:"}
                        </span>
                        <span className={styles.content}>
                            {hasNoMessages ? "No messages." : (
                                conversation.messages[0].content.length > 20
                                    ? conversation.messages[0].content.slice(0, 19) + "..."
                                    : conversation.messages[0].content
                            )}
                        </span>
                    </p>
                    {hasNoMessages
                        ? null
                        : (
                            <p className={styles.date}>
                                {formatDistanceToNow(conversation.messages[0].createdAt, { addSuffix: true })}
                            </p>
                        )}
                </>
            )
        )}
    </NavLink>
}

export default SingleConversation;
