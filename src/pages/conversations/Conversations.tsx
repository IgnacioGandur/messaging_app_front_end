import styles from "./Conversations.module.css";
import { useLoaderData, Outlet, NavLink } from "react-router";
import ServerError from "../../components/server-error/ServerError";
import { useRouteLoaderData } from "react-router";
import type Conversation from "../../types/conversation";
import { formatDistanceToNow } from "date-fns";

const Conversations = () => {
    const rootData = useRouteLoaderData("root");
    const loggedUser = rootData?.user;
    const loaderData = useLoaderData();
    const conversations: Conversation[] = loaderData?.conversations;

    return <main className={styles.conversations}>
        {loaderData?.error && <ServerError title="Server Error" message={loaderData?.message} />}
        <div className={styles.wrapper}>
            <section className={styles["chats-sidebar"]}>
                <div className={styles.title}>
                    <span className={`material-symbols-rounded ${styles.icon}`}>
                        conversation
                    </span>
                    <div className={styles.separator}></div>
                    <h3 className={styles.text}>
                        Conversations
                    </h3>
                </div>
                {conversations && conversations.length === 0 ? (
                    <div className={styles["no-conversations"]}>
                        <p>
                            You don't have any conversations yet...
                        </p>
                    </div>
                ) : (
                    conversations.map((conversation) => {
                        return <NavLink
                            key={conversation.id}
                            to={`/conversations/${conversation.id}`}
                            className={({ isActive }) =>
                                isActive ? `
                                        ${styles.active} 
                                        ${styles.conversation}
                                    ` : styles.conversation
                            }
                        >
                            {({ isPending }) => (
                                isPending ? (
                                    <div className={styles.loader}>
                                        <span className="material-symbols-rounded">
                                            app_badging
                                        </span>
                                    </div>
                                ) : (
                                    <>
                                        {
                                            (() => {
                                                const user = conversation.participants.find((p) => p.userId !== loggedUser?.id);

                                                return <>
                                                    <h2
                                                        className={styles.name}
                                                    >
                                                        {conversation.isGroup ? conversation.title : user?.user.firstName + " " + user?.user.lastName}
                                                    </h2>
                                                    {conversation.isGroup ? (
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
                                            })()
                                        }
                                        <p className={styles["last-message"]}>
                                            <span className={styles.you}>
                                                {conversation.messages[0].senderId === loggedUser.id && "You:"}
                                            </span>
                                            <span className={styles.content}>
                                                {conversation.messages.length === 0 ? "No messages." : (
                                                    conversation.messages[0].content.length > 20
                                                        ? conversation.messages[0].content.slice(0, 19) + "..."
                                                        : conversation.messages[0].content
                                                )}
                                            </span>
                                        </p>
                                        {
                                            conversation.messages.length === 0
                                                ? null
                                                : (
                                                    <p className={styles.date}>
                                                        {formatDistanceToNow(conversation.messages[0].createdAt, { addSuffix: true, includeSeconds: true })}
                                                    </p>
                                                )
                                        }
                                    </>
                                )
                            )}
                        </NavLink>
                    })
                )}
            </section>
            <Outlet />
        </div>
    </main >
}

export default Conversations;
