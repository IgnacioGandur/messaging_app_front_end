import { useState } from "react";
import styles from "./CurrentConversation.module.css";
import { useLoaderData, useFetcher, useRouteLoaderData } from "react-router";
import ServerError from "../../../../components/server-error/ServerError";
import type Conversation from "../../../../types/conversation";
import type Message from "../../../../types/message";
import type User from "../../../../types/user";
import InputErrors from "../../../../components/input-errors/InputErrors";
import Messages from "./messages/Messages";
import MessageForm from "./message-form/MessageForm";

const CurrentConversation = () => {
    const loaderData = useLoaderData();
    const rootData = useRouteLoaderData("root");
    const loggedUser: User = rootData?.user;
    const conversation: Conversation = loaderData?.conversation;
    const userB = conversation.participants.find((p) => p.user.id !== loggedUser.id)?.user;
    const messages: Message[] = loaderData?.conversation?.messages;
    const fetcher = useFetcher();
    const [message, setMessage] = useState("");

    const handleMessage = (message: string) => {
        setMessage(message);
    };

    const deleteMessage = (id: number): void => {
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

    if (loaderData?.conversation?.isGroup) {
        return <section className={styles["group-conversation"]}>
            <header className={styles["group-info"]}>
                <img
                    src={conversation.profilePicture}
                    alt={`${conversation.title}'s profile picture`}
                    className={styles["group-profile-picture"]}
                />
                <h2>
                    {conversation.title}
                </h2>
                <div className={styles.container}>
                    <p className={styles["participants-n"]}>
                        Participants: {conversation.participants.length}
                    </p>
                    <p className={styles["messages-n"]}>
                        Messages: {conversation.messages.length}
                    </p>
                </div>
                <section className={styles.message}>

                </section>
            </header>
            <Messages
                messages={conversation.messages}
                loggedUserId={loggedUser.id}
                deleteMessage={deleteMessage}
            />
            <MessageForm
                handleMessage={handleMessage}
                message={message}
            />
        </section>
    }

    return <section className={styles["current-conversation"]}>
        {loaderData.error && <ServerError title="Server Error" message={loaderData.message} />}
        {!loaderData.success && <InputErrors
            message={loaderData?.message}
            errors={loaderData?.errors}
        />}
        {loaderData.data?.error && <p>
            {loaderData.data?.message}
        </p>}
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
        <Messages
            messages={messages}
            deleteMessage={deleteMessage}
            loggedUserId={loggedUser.id}
        />
        <MessageForm
            message={message}
            handleMessage={handleMessage}
        />
    </section>
}

export default CurrentConversation;
