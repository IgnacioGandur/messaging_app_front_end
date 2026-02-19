import deletedUserImage from "../../../../assets/images/deleted-user.png";
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
import SubmitionLoader from "../../../../components/submition-loader/SubmitionLoader";
import PrivateConversationDetails from "./private-conversation-details/PrivateConversationDetails";
import NoConversation from "./no-results/NoResults";

// Types
import type Conversation from "../../../../types/conversation";
import type User from "../../../../types/user";
import type InputErrorsType from "../../../../types/InputErrors";
import type Group from "../../../../types/group";
import type RootLoaderDataProps from "../../../../types/rootLoaderData";

// Hooks
import { useConversationMessages } from "../../../../hooks/useConversationMessages";

export interface CurrentConversationLoaderData {
    success: boolean;
    message: string;
    messageCursorId: number;
    hasMore: boolean;
    conversation: Conversation | Group;
    error?: boolean;
    errors?: InputErrorsType[];
};

const CurrentConversation = () => {
    const fetcher = useFetcher();
    const navigation = useNavigation();
    const loaderData = useLoaderData() as CurrentConversationLoaderData;
    const { conversationId } = useParams();

    if (!loaderData?.success) {
        return <NoConversation>
            <InputErrors
                message={loaderData.message}
                errors={loaderData.errors}
            />
        </NoConversation>
    }

    const rootData = useRouteLoaderData("root") as RootLoaderDataProps;
    const loggedUser = rootData?.user;

    const conversation = loaderData?.conversation as Group;
    const userB = conversation.participants.find((p) =>
        p.user.id !== loggedUser!.id)?.user
        || {
            firstName: "Deleted",
            lastName: "User.",
            username: "###",
            profilePictureUrl: deletedUserImage,
            id: 0,
            joinedOn: new Date()
        } as User;

    const {
        messages,
        hasMoreMessages,
        isLoadingMoreMessages,
        loadOlderMessages
    } = useConversationMessages(loaderData, conversationId);

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

    const isDeletingMessage = fetcher.state === "submitting"
        && fetcher?.formData?.get("intent") === "delete-message"

    const isPageLoading = navigation.state === "loading";


    if (isPageLoading) {
        return <Loader />
    }

    if (conversation?.isGroup) {
        return <section className={styles["group-conversation"]}>
            {isDeletingMessage && <SubmitionLoader
                message="Deleting message, please wait..."
            />}
            <GroupDetails
                group={conversation}
            />
            <Messages
                isLoadingOlderMessages={isLoadingMoreMessages}
                loadOlderMessages={loadOlderMessages}
                hasMoreMessages={hasMoreMessages}
                messages={messages}
            />
            <MessageForm
                message={message.message}
                handleMessage={handleMessage}
                setMessage={setMessage}
            />
        </section>
    }

    // If is a private conversation between 2 users.
    return <section className={styles["private-conversation"]}>
        {loaderData.error && <ServerError message={loaderData.message} />}
        {!loaderData.success && <InputErrors
            message={loaderData?.message}
            errors={loaderData?.errors}
        />}
        {isDeletingMessage && <SubmitionLoader
            message="Deleting message, please wait..."
        />}
        {userB && (
            <PrivateConversationDetails
                userB={userB}
            />
        )}
        <Messages
            isLoadingOlderMessages={isLoadingMoreMessages}
            loadOlderMessages={loadOlderMessages}
            hasMoreMessages={hasMoreMessages}
            messages={messages}
        />
        <MessageForm
            message={message.message}
            handleMessage={handleMessage}
            setMessage={setMessage}
        />
    </section>
}

export default CurrentConversation;
