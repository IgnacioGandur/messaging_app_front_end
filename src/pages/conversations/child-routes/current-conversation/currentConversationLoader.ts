import type { LoaderFunctionArgs } from "react-router";
import apiRequestLoader from "../../../../utils/apiRequestLoader";
import type Conversation from "../../../../types/conversation";

interface ConversationResponse {
    success: boolean;
    message: string;
    conversation: Conversation;
};

export default async function currentConversationLoader({ params }: LoaderFunctionArgs) {
    const url = `${import.meta.env.VITE_API_BASE}/conversations/${params.conversationId}`;
    const options: RequestInit = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    };

    const result = await apiRequestLoader<ConversationResponse>(url, options);
    return result;
}
