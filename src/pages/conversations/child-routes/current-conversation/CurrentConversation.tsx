import deletedUserImage from "../../../../assets/images/deleted-user.png";
import styles from "./CurrentConversation.module.css";

import {
    useLoaderData,
    useRouteLoaderData,
    useNavigation,
    useParams
} from "react-router";

// Components
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

    const isPageLoading = navigation.state === "loading";

    if (isPageLoading) {
        return <Loader />
    }

    return <section
        className={conversation.isGroup ? styles["group-conversation"] : styles["private-conversation"]}
    >
        {conversation.isGroup ? (
            <GroupDetails
                group={conversation}
            />
        ) : (
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
        <MessageForm />
    </section>
}

export default CurrentConversation;
