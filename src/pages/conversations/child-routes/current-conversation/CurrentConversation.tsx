import styles from "./CurrentConversation.module.css";

// Packages
import {
    useEffect,
    useState,
} from "react";

import {
    useLoaderData,
    useFetcher,
    useRouteLoaderData,
    useNavigation,
    useParams
} from "react-router";

// Components
import ServerError from "../../../../components/server-error/ServerError";
import InputErrors from "../../../../components/input-errors/InputErrors";
import MessageForm from "./message-form/MessageForm";
import Messages from "./messages/Messages";
import GroupDetails from "./group-details/GroupDetails";
import Loader from "./loader/Loader";

// Types
import type Conversation from "../../../../types/conversation";
import type Message from "../../../../types/message";
import type User from "../../../../types/user";
import type InputErrorsType from "../../../../types/InputErrors";
import { NavLink } from "react-router";

const CurrentConversation = () => {
    const fetcher = useFetcher();
    const { conversationId } = useParams();
    const navigation = useNavigation();
    const loaderData = useLoaderData() as {
        success: boolean;
        message: string;
        messageCursorId: number;
        hasMore: boolean;
        conversation: Conversation;
        error?: boolean;
        errors?: InputErrorsType[];
    }

    const rootData = useRouteLoaderData("root");
    const loggedUser: User = rootData?.user;

    const conversation = loaderData?.conversation;
    const userB = conversation.participants.find((p) => p.user.id !== loggedUser.id)?.user;

    // Conversation messages.
    const initialMessages: Message[] = loaderData?.conversation?.messages;
    const [messages, setMessages] = useState<Message[]>(
        initialMessages.slice().reverse()
    );
    const [hasMoreMessages, setHasMoreMessages] = useState(
        loaderData.hasMore
    );
    const [cursor, setCursor] = useState<number | null>(loaderData.messageCursorId);
    const [isLoadingMoreMessages, setIsLoadingMoreMessages] = useState(false);

    const loadOlderMessages = async () => {
        if (!cursor || isLoadingMoreMessages || !hasMoreMessages) return;

        try {
            setIsLoadingMoreMessages(true);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE}/conversations/${conversationId}/messages?cursor=${cursor}`,
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                }
            );

            const { data } = await response.json() as {
                success: boolean;
                message: string;
                data: {
                    messages: Message[];
                    nextCursor: number;
                    hasMore: boolean;
                }
            };

            const orderedMessages = data.messages.slice().reverse();

            setMessages((prev) => [...orderedMessages, ...prev]);
            setCursor(data.nextCursor);
            setHasMoreMessages(data.hasMore);
        } catch (error) {
            console.error("Failed to load more messages:", error);
        } finally {
            setIsLoadingMoreMessages(false);
        }
    };

    const [message, setMessage] = useState<
        {
            message: string;
            attachment: null | File;
        }
    >({
        message: "",
        attachment: null
    });

    const handleMessage = (
        field: string,
        value: string
    ) => {
        setMessage((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleMessageDeletion = (messageId: number) => {
        fetcher.submit({
            intent: "delete-message",
            messageId,
        }, { method: "DELETE" });
    };

    useEffect(() => {
        if (loaderData?.conversation?.messages) {
            setMessages(loaderData?.conversation?.messages.slice().reverse());
            setHasMoreMessages(loaderData.hasMore);
            setCursor(loaderData.messageCursorId);
        };
    }, [loaderData]);

    if (!loaderData?.success) {
        return <p>no conversation</p>
    }

    if (conversation?.isGroup) {
        return navigation.state === "loading"
            ?
            <Loader />
            : <section className={styles["group-conversation"]}>
                <GroupDetails
                    groupPpf={conversation.profilePicture}
                    groupTitle={conversation.title}
                    participants={conversation.participants}
                    date={conversation.createdAt}
                    groupDescription={conversation.description}
                />
                <Messages
                    isLoadingOlderMessages={isLoadingMoreMessages}
                    loadOlderMessages={loadOlderMessages}
                    hasMoreMessages={hasMoreMessages}
                    messages={messages}
                    loggedUserId={loggedUser.id}
                    handleMessageDeletion={handleMessageDeletion}
                />
                <MessageForm
                    message={message.message}
                    handleMessage={handleMessage}
                    setMessage={setMessage}
                />
            </section>
    }

    // If is a private conversation between 2 users.
    return navigation.state === "loading"
        ? <Loader />
        : <section className={styles["private-conversation"]}>
            {loaderData.error && <ServerError title="Server Error" message={loaderData.message} />}
            {!loaderData.success && <InputErrors
                message={loaderData?.message}
                errors={loaderData?.errors}
            />}
            <header
                id="user-b-info"
                className={styles["user-b-info"]}
            >
                <NavLink
                    to={`/users/${userB?.id}`}
                    className={styles.user}
                >
                    <img
                        className={styles["profile-picture"]}
                        src={userB?.profilePictureUrl}
                        alt={`${userB?.firstName} ${userB?.lastName}'s profile picture.`}
                    />
                    <h2
                        className={styles.name}
                    >
                        {userB?.firstName} {userB?.lastName}
                    </h2>
                    <p className={styles.username}>
                        @{userB?.username}
                    </p>
                </NavLink>
            </header>
            {fetcher.state === "submitting" && fetcher?.formData?.get("intent") === "delete-message" && <p>
                Deleting message...
            </p>}
            <Messages
                isLoadingOlderMessages={isLoadingMoreMessages}
                loadOlderMessages={loadOlderMessages}
                hasMoreMessages={hasMoreMessages}
                messages={messages}
                loggedUserId={loggedUser.id}
                handleMessageDeletion={handleMessageDeletion}
            />
            <MessageForm
                message={message.message}
                handleMessage={handleMessage}
                setMessage={setMessage}
            />
        </section>
}

export default CurrentConversation;
