import type { LoaderFunctionArgs } from "react-router";
import apiRequest from "../../../../utils/apiRequest";
import type Conversation from "../../../../types/conversation";

export default async function currentConversationLoader({ params }: LoaderFunctionArgs) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const url = `${import.meta.env.VITE_API_BASE}/conversations/${params.conversationId}`;
    const options: RequestInit = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    };

    return await apiRequest<Conversation>(url, options);
}
