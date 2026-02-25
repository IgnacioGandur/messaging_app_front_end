import { useFetcher } from "react-router";
import { useState, useEffect } from "react";
import type Conversation from "../../types/conversation";

interface ApiResponse {
    success: boolean;
    message: string;
    data: {
        conversations: Conversation[];
        count: number;
    }
};

export type Status = "hide" | "list" | "conversation";

const useConversations = () => {
    const fetcher = useFetcher<ApiResponse>();
    const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
    const [status, setStatus] = useState<Status>("hide");

    useEffect(() => {
        if (fetcher.state === "idle" && !fetcher.data) {
            fetcher.load("/get-floating-conversations");
        }
    }, [fetcher]);

    const conversations = fetcher.data?.data?.conversations ?? [];
    const isLoading = fetcher.state === "loading";
    const error = fetcher.data?.success === false ? fetcher.data.message : null;

    return {
        isLoading,
        conversations,
        status,
        error,
        setStatus,
        currentConversationId,
        setCurrentConversationId
    }
}

export default useConversations;
