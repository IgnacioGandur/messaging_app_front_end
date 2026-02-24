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
    const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [status, setStatus] = useState<Status>("hide");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchConversations = async () => {
            await new Promise(r => setTimeout(r, 2000));
            const url = `${import.meta.env.VITE_API_BASE}/conversations?take=5`;
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

                if (result) {
                    setConversations(result.data.conversations);
                }
            } catch (error) {
                console.error("Error while loading conversations in the floating chat:", error);
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("Error while trying to get conversations.");
                }
            } finally {
                setIsLoading(false);
            }
        }

        fetchConversations();
    }, []);

    return {
        conversations,
        status,
        error,
        isLoading,
        setStatus,
        currentConversationId,
        setCurrentConversationId
    }
}

export default useConversations;
