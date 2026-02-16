import type { LoaderFunctionArgs } from "react-router";
import apiRequestLoader from "../../../../utils/apiRequestLoader";
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

    return await apiRequestLoader<Conversation>(url, options);
}
