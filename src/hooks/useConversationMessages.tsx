import { useEffect, useState } from "react";
import apiRequestLoader from "../utils/apiRequestLoader";
import type { CurrentConversationLoaderData } from "../pages/conversations/child-routes/current-conversation/CurrentConversation";
import type Message from "../types/message";

interface MoreMessagesResponse {
    success: boolean;
    message: string;
    data: {
        messages: Message[];
        nextCursor: number | null;
        hasMore: boolean;
    };
};

export const useConversationMessages = (
    loaderData: CurrentConversationLoaderData,
    conversationId: string | undefined
) => {
    const [messages, setMessages] = useState<Message[]>(
        loaderData?.conversation?.messages.slice().reverse() || []
    );

    const [hasMoreMessages, setHasMoreMessages] = useState(loaderData.hasMore);
    const [cursor, setCursor] = useState<number | null>(loaderData.messageCursorId);
    const [isLoadingMoreMessages, setIsLoadingMessages] = useState(false);

    const loadOlderMessages = async () => {
        if (!cursor || isLoadingMoreMessages || !hasMoreMessages) return;

        try {
            setIsLoadingMessages(true);
            const url = `${import.meta.env.VITE_API_BASE}/conversations/${conversationId}/messages?cursor=${cursor}`;
            const { data } = await apiRequestLoader<MoreMessagesResponse>(url);

            const orderedMessages = data.messages.slice().reverse();

            setMessages((prev) => [...orderedMessages, ...prev]);
            setCursor(data.nextCursor);
            setHasMoreMessages(data.hasMore);

        } catch (error) {
            console.error("Failed to load more messages:", error);
        } finally {
            setIsLoadingMessages(false);
        }
    };

    useEffect(() => {
        if (loaderData?.conversation?.messages) {
            setMessages(loaderData.conversation.messages.slice().reverse());
            setHasMoreMessages(loaderData.hasMore);
            setCursor(loaderData.messageCursorId);
        }
    }, [loaderData]);

    return {
        messages,
        hasMoreMessages,
        isLoadingMoreMessages,
        loadOlderMessages
    };
};
