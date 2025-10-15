import { useState } from "react";
import styles from "./CurrentConversation.module.css";
import { useLoaderData, useFetcher, useRouteLoaderData } from "react-router";
import ServerError from "../../../../components/server-error/ServerError";
import type Conversation from "../../../../types/conversation";
import type Message from "../../../../types/message";
import type Participant from "../../../../types/participant";
import type User from "../../../../types/user";

const CurrentConversation = () => {
    const loaderData = useLoaderData();
    const rootData = useRouteLoaderData("root");
    const loggedUser: User = rootData?.user;
    const conversation: Conversation = loaderData?.conversation;
    const userB = conversation.participants.find((p: Participant) => p.user.id !== loggedUser.id)?.user;
    const messages: Message[] = loaderData?.conversation?.messages;
    const fetcher = useFetcher();
    const [message, setMessage] = useState("");

    const handleMessage = (message: string) => {
        setMessage(message);
    };

    return <section className={styles["current-conversation"]}>
        {loaderData.error && <ServerError title="Server Error" message={loaderData.message} />}
        <header className={styles["user-b-info"]}>
            <img
                className={styles["profile-picture"]}
                src={userB?.profilePictureUrl}
                alt={`${userB?.firstName} ${userB?.lastName}'s profile picture.`}
            />
            <h2>
                {userB?.firstName} {userB?.lastName}
            </h2>
            <p className={styles.username}>
                {userB?.username}
            </p>
        </header>
        <section className={styles.messages}>
            {messages.map((message: Message) => {
                return <p
                    key={message.id}
                    className="message"
                >
                    {message.content}
                </p>
            })}
        </section>
        <fetcher.Form
            method="post"
            className={styles["send-message"]}
        >
            <input
                id="message"
                type="text"
                name="message"
                placeholder="Send a message..."
                value={message}
                onChange={(e) => handleMessage(e.target.value)}
            />
            <button type="submit">
                <span className="material-symbols-rounded">
                    send
                </span>
            </button>
        </fetcher.Form>
    </section>
}

export default CurrentConversation;
