import styles from "./Conversations.module.css";
import { useLoaderData, Outlet, NavLink } from "react-router";
import ServerError from "../../components/server-error/ServerError";
import { useRouteLoaderData } from "react-router";
import type Conversation from "../../types/conversation";

const Conversations = () => {
    const rootData = useRouteLoaderData("root");
    const loggedUser = rootData?.user;
    const loaderData = useLoaderData();
    const conversations: Conversation[] = loaderData?.conversations;

    return <main className={styles.conversations}>
        {loaderData?.error && <ServerError title="Server Error" message={loaderData?.message} />}
        <div className={styles.wrapper}>
            <section className={styles["chats-sidebar"]}>
                {conversations && conversations.length === 0 ? (
                    <div className={styles["no-conversations"]}>
                        <p>
                            You don't have any conversations yet...
                        </p>
                    </div>
                ) : (
                    conversations.map((conversation) => {
                        return conversation.isGroup ? (
                            <NavLink
                                key={conversation.id}
                                to={`/conversations/${conversation.id}`}
                                className={styles.conversation}
                            >
                                <img
                                    className={styles["profile-picture"]}
                                    src={conversation.profilePicture}
                                    alt={`Group ${conversation.title} profile's picture.`}
                                />
                                <h2
                                    className={styles["group-title"]}
                                >
                                    {conversation.title}
                                </h2>
                                <p className={styles["last-message"]}>
                                    {conversation.messages.length === 0 ? (
                                        "No messages"
                                    ) : (
                                        conversation.messages[0].content
                                    )}
                                </p>
                            </NavLink>
                        ) : conversation.participants.map((participant) => {
                            return <NavLink
                                key={`${conversation.id}-${participant.user.id}`}
                                to={`/conversations/${conversation.id}`}
                                className={styles.conversations}
                            >
                                {participant.user.id === loggedUser.id
                                    ? null
                                    : (<div
                                        key={participant.user.username}
                                        className={styles.conversation}
                                    >
                                        <div className={styles["ppf-and-name"]}>
                                            <img
                                                className={styles["profile-picture"]}
                                                src={participant.user.profilePictureUrl}
                                                alt={`${participant.user.username}'s profile picture.`}
                                            />
                                            <div className={styles.names}>
                                                <h2>
                                                    {participant.user.firstName} {participant.user.lastName}
                                                </h2>
                                                <p className={styles.username}>
                                                    {participant.user.username}
                                                </p>
                                            </div>
                                        </div>
                                        <p className={styles["last-message"]}>
                                            {conversation.messages.length > 0 ? conversation.messages[0].content : "No messages."}
                                        </p>
                                    </div>)
                                }
                            </NavLink>
                        })
                    })
                )}
            </section>
            <Outlet />
        </div>
    </main>
}

export default Conversations;
