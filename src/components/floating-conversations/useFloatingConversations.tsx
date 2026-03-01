import { useFetcher } from "react-router";
import { useState, useEffect } from "react";
import type Conversation from "../../types/conversation";
import type RootLoaderDataProps from "../../types/rootLoaderData";
import { useRouteLoaderData } from "react-router";

interface ApiResponse {
    success: boolean;
    message: string;
    data: {
        conversations: Conversation[];
        count: number;
    }
};

export type Status = "hide" | "list" | "conversation";

const useFloatingConversations = () => {
    const fetcher = useFetcher<ApiResponse>();
    const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
    const [status, setStatus] = useState<Status>("hide");

    const rootData = useRouteLoaderData("root") as RootLoaderDataProps;
    const isAuthenticated = !!(rootData.success && rootData.user);

    useEffect(() => {
        if (isAuthenticated && fetcher.state === "idle" && !fetcher.data) {
            fetcher.load("/get-floating-conversations");
        }
    }, [fetcher, isAuthenticated]);

    const conversations = fetcher.data?.data?.conversations ?? [];
    const isLoading = fetcher.state !== "idle";
    const error = (isAuthenticated
        && fetcher.data?.success === false)
        ? "We were not able to retrieve you conversations."
        : null;

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

export default useFloatingConversations;
