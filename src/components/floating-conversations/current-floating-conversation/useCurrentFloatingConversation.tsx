import { useFetcher } from "react-router";
import { useEffect } from "react";
import type Conversation from "../../../types/conversation";
import type InputError from "../../../types/InputErrors";

interface ApiResponse {
    success: boolean;
    message: string;
    conversation: Conversation;
    errors?: InputError[];
};

const useCurrentFloatingConversation = (
    conversationId: number
) => {
    const fetcher = useFetcher<ApiResponse>();

    useEffect(() => {
        if (fetcher.state === "idle" && !fetcher.data) {
            fetcher.load(`/get-floating-conversations/${conversationId}`);
        };
    }, [conversationId]);

    const conversation = fetcher.data?.conversation;
    const isLoading = fetcher.state === "loading";
    const error = fetcher.data?.errors ? fetcher.data?.errors[0].msg : null;

    return {
        isLoading,
        error,
        conversation
    };
};

export default useCurrentFloatingConversation;
