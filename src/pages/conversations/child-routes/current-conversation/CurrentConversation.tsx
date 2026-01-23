import styles from "./CurrentConversation.module.css";

// Packages
import {
    useState,
    useCallback,
    useEffect
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
import GroupConversation from "./group-conversation/GroupConversation";
import Loader from "./loader/Loader";

// Types
import type Conversation from "../../../../types/conversation";
import type Message from "../../../../types/message";
import type User from "../../../../types/user";
import type InputErrorsType from "../../../../types/InputErrors";

const CurrentConversation = () => {
    const fetcher = useFetcher();
    const navigation = useNavigation();
    const loaderData = useLoaderData() as {
        success: boolean;
        message: string;
        conversation: Conversation;
        error?: boolean;
        errors?: InputErrorsType[];
    }

    const rootData = useRouteLoaderData("root");
    const loggedUser: User = rootData?.user;

    const conversation = loaderData?.conversation;
    const userB = conversation.participants.find((p) => p.user.id !== loggedUser.id)?.user;
    const { conversationId } = useParams();

    // Conversation messages.
    const initialMessages: Message[] = loaderData?.conversation?.messages;
    const [messages, setMessages] = useState<Message[]>(
        initialMessages.slice().reverse()
    );
    const [cursor, setCursor] = useState<Date | null>(
        messages.length ? messages[0].createdAt : null
    );
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const loadOlderMessages = useCallback(
        async () => {
            if (!cursor || isLoadingMore || !hasMore) return;

            setIsLoadingMore(true);

            const cursorDate = cursor ? cursor.toISOString() : "";
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE}/conversations/${conversationId}/messages?cursor=${cursorDate}&limit=10`,
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                }
            );

            const result = await response.json() as {
                success: boolean;
                message: string;
                data: {
                    messages: Message[];
                    nextCursor: Date;
                    hasMore: boolean;
                }
            };

            const fetched = result.data.messages;

            if (fetched.length === 0) {
                setHasMore(false);
                setIsLoadingMore(false);
                return;
            };

            setMessages((prev => {
                const map = new Map(prev.map((m) => [m.id, m]));
                fetched.forEach((m) => map.set(m.id, m));
                return Array.from(map.values()).sort(
                    (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
                );
            }));

            setCursor(fetched[fetched.length - 1].createdAt);
            setHasMore(result.data.hasMore);
            setIsLoadingMore(false);
        }, [cursor, hasMore, isLoadingMore, conversationId]
    );

    useEffect(() => {
        if (!fetcher.data) return;

        if (fetcher.data?.intent === "send-message") {
            setMessages((prev) => [...prev, fetcher.data.message]);
        }

        if (fetcher.data.intent === "delete-message") {
            setMessages((prev) =>
                prev.map((m) =>
                    m.id === fetcher.data.messageId
                        ? { ...m, deleted: true }
                        : m
                )
            );
        };
    }, [fetcher.data]);

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

    if (!loaderData?.success) {
        return <p>no conversation</p>
    }

    if (conversation?.isGroup) {
        return navigation.state === "loading"
            ?
            <Loader />
            : <section className={styles["group-conversation"]}>
                <GroupConversation
                    groupPpf={conversation.profilePicture}
                    groupTitle={conversation.title}
                    participants={conversation.participants}
                    date={conversation.createdAt}
                    groupDescription={conversation.description}
                />
                <Messages
                    messages={messages}
                    onLoadOlder={loadOlderMessages}
                    hasMore={hasMore}
                    loggedUserId={loggedUser.id}
                    deleteMessage={(id) => fetcher.submit(
                        { intent: "delete-message", messageId: id },
                        { method: "DELETE" }
                    )}
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
        : <section className={styles["current-conversation"]}>
            {loaderData.error && <ServerError title="Server Error" message={loaderData.message} />}
            {!loaderData.success && <InputErrors
                message={loaderData?.message}
                errors={loaderData?.errors}
            />}
            {/* {loaderData.data?.error && <p> */}
            {/*     {loaderData.data?.message} */}
            {/* </p>} */}
            <header className={styles["user-b-info"]}>
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
            </header>
            {fetcher.state === "submitting" && !fetcher?.formData?.get("intent") && (
                <p>
                    Sending message
                </p>
            )}
            {fetcher.state === "submitting" && fetcher?.formData?.get("intent") === "delete-message" && <p>
                Deleting message...
            </p>}
            {/* <Messages */}
            {/*     initialMessages={messages} */}
            {/*     loggedUserId={loggedUser.id} */}
            {/*     deleteMessage={deleteMessage} */}
            {/* /> */}
            <MessageForm
                message={message.message}
                handleMessage={handleMessage}
                setMessage={setMessage}
            />
        </section>
}

export default CurrentConversation;
