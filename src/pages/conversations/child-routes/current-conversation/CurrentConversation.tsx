import { useEffect, useState } from "react";
import styles from "./CurrentConversation.module.css";
import { useLoaderData, useFetcher, useRouteLoaderData } from "react-router";
import ServerError from "../../../../components/server-error/ServerError";
import type Conversation from "../../../../types/conversation";
import type Message from "../../../../types/message";
import type Participant from "../../../../types/participant";
import type User from "../../../../types/user";
import InputErrors from "../../../../components/input-errors/InputErrors";

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

    const deleteMessage = (id: number) => {
        fetcher.submit(
            {
                messageId: id,
                intent: "delete-message"
            },
            {
                method: "DELETE",
            }
        );
    };

    if (!loaderData?.success) {
        return <p>no conversation</p>
    }

    return <section className={styles["current-conversation"]}>
        {loaderData.error && <ServerError title="Server Error" message={loaderData.message} />}
        {!loaderData.success && <InputErrors
            message={loaderData?.message}
            errors={loaderData?.errors}
        />}
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
        {fetcher.state === "submitting" && !fetcher?.formData?.get("intent") && (
            <p>
                Sending message
            </p>
        )}
        {fetcher.state === "submitting" && fetcher?.formData?.get("intent") === "delete-message" && <p>
            Deleting message...
        </p>}
        <section className={styles.messages}>
            {messages.map((message: Message) => {
                return <div
                    key={message.id}
                    className={`${styles.message} ${message.senderId === loggedUser.id ? styles.you : styles.userB}`}
                >
                    {(message.senderId === loggedUser.id && !message.deleted) && (
                        <button
                            onClick={() => { deleteMessage(message.id) }}
                        >
                            <span className="material-symbols-rounded">
                                close
                            </span>
                        </button>
                    )}
                    <span className="date">
                        {message.createdAt.toString()}
                    </span>
                    <p className="content">
                        {message.content}
                    </p>
                </div>
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
