import { useState } from "react";
import styles from "./CurrentConversation.module.css";
import { useLoaderData, useFetcher, useRouteLoaderData } from "react-router";
import ServerError from "../../../../components/server-error/ServerError";
import type Conversation from "../../../../types/conversation";
import type Message from "../../../../types/message";
import type User from "../../../../types/user";
import type Participant from "../../../../types/participant";
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
    const participants: Participant[] = conversation?.participants;
    const fetcher = useFetcher();
    const [message, setMessage] = useState("");
    const [showParticipants, setShowParticipants] = useState(false);
    const groupOwner = participants.find((p) => p.role === "OWNER");
    const loggedUserAsParticipant = participants.find((p) => p.userId === loggedUser.id);

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

    const toggleAdminship = (
        userId: number,
        role: "USER" | "ADMIN",
    ) => {
        fetcher.submit(
            {
                intent: "toggle-admin-status",
                userId,
                role
            },
            {
                method: "POST"
            }
        );
    };

    const removeFromGroup = (
        userId: number,
    ) => {
        fetcher.submit(
            {
                intent: "remove-from-group",
                userId
            },
            {
                method: "POST"
            }
        )
    };

    if (!loaderData?.success) {
        return <p>no conversation</p>
    }

    if (loaderData?.conversation?.isGroup) {
        return <section className={styles["group-conversation"]}>
            {showParticipants && (
                <div className={styles.participants}>
                    <button
                        onClick={() => setShowParticipants(false)}
                    >
                        <span className="material-symbols-rounded">
                            close
                        </span>
                    </button>
                    {conversation.participants.map((p) => {
                        return <article
                            key={p.userId}
                            className={styles.participant}
                        >
                            <span className="material-symbols-rounded">
                                {p.role === "OWNER"
                                    ? "crown"
                                    : p.role === "ADMIN"
                                        ? "shield_person"
                                        : "person"}
                            </span>
                            <span>
                                {p.role}
                            </span>
                            <h2>
                                {p.user.firstName} {p.user.lastName}
                            </h2>
                            <p>@{p.user.username}</p>
                            <div className={styles.buttons}>
                                {loggedUserAsParticipant?.userId === p.userId && (
                                    <p>
                                        <i>
                                            You
                                        </i>
                                    </p>
                                )}
                                {(() => {
                                    // HANDLE ADMINSHIP STATUS OF PARTICIPANTS
                                    // Only group owner can give or take away admin status from group participants.

                                    const loggedUserIsOwner = loggedUserAsParticipant?.role === "OWNER";

                                    return loggedUserIsOwner && p.role === "OWNER"
                                        ? null
                                        : loggedUserIsOwner && p.role === "ADMIN"
                                            || loggedUserIsOwner && p.role === "USER"
                                            ? (
                                                <button
                                                    onClick={() => toggleAdminship(
                                                        p.userId,
                                                        p.role === "ADMIN"
                                                            ? "USER"
                                                            : "ADMIN"
                                                    )}
                                                >
                                                    {
                                                        p.role === "USER"
                                                            ? "Make admin"
                                                            : "Remove adminship"
                                                    }
                                                </button>
                                            ) : null
                                })()}
                                {(() => {
                                    // HANDLE USER REMOVAL FROM GROUP.

                                    // If logged user is group owner or admin, he can remove user from group.
                                    // Admin can't remove another admin from group.

                                    const isOwner = loggedUserAsParticipant?.role === "OWNER";
                                    const isAdmin = loggedUserAsParticipant?.role === "ADMIN";

                                    return isOwner && p.role === "OWNER"
                                        ? null
                                        : isOwner
                                            || isAdmin && p.role === "USER"
                                            ? (<button
                                                onClick={() => removeFromGroup(p.userId)}
                                            >
                                                Remove from group
                                            </button>)
                                            : null
                                })()}
                            </div>
                        </article>
                    })}
                </div>
            )}
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
                    <button
                        onClick={() => setShowParticipants(true)}
                        className={styles["participants-n"]}
                    >
                        Participants: {conversation.participants.length}
                    </button>
                    <p className={styles["messages-n"]}>
                        Messages: {conversation.messages.length}
                    </p>
                    {(() => {
                        const owner = conversation.participants.find((p) => {
                            return p.role === "OWNER" ? p : null;
                        });
                        return <div className={styles["group-owner"]}>
                            <p className={styles["group-owner"]}>
                                <span>Group owner: </span><span>{owner?.user.firstName} {owner?.user.lastName}</span>
                            </p>
                        </div>
                    })()}
                    {(() => {
                        let admins = 0;
                        for (let i = 0; i < conversation.participants.length; i++) {
                            conversation.participants[i].role === "ADMIN" ? admins += 1 : null
                        }

                        return <div className={styles["group-admins"]}>
                            <span>Admins: </span><span>{admins}</span>
                        </div>
                    })()}
                </div>
            </header>
            <Messages
                messages={conversation.messages}
                loggedUserId={loggedUser.id}
                deleteMessage={deleteMessage}
                participants={participants}
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
