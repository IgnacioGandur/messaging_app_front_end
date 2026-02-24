import { useEffect, useState } from "react";
import type Conversation from "../../../types/conversation";

interface ApiResponse {
    success: boolean;
    message: string;
    conversation: Conversation;
};

const useFetchCurrentConversation = (
    conversationId: number
) => {
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchErorr] = useState<string | null>(null);
    const [conversation, setConversation] = useState<Conversation | null>(null);

    useEffect(() => {
        const fetchConversation = async () => {
            const url = `${import.meta.env.VITE_API_BASE}/conversations/${conversationId}`;
            const options: RequestInit = {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            };

            setIsLoading(true);
            try {
                const response = await fetch(url, options);
                const result = await response.json() as ApiResponse;
                if (result.success) {
                    setConversation(result.conversation);
                }
            } catch (error) {
                if (error instanceof Error) {
                    setFetchErorr(error.message);
                } else {
                    setFetchErorr("We were not able to get the conversation.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchConversation();
    }, [conversationId]);

    return {
        isLoading,
        fetchError,
        conversation
    };
};

export default useFetchCurrentConversation;
