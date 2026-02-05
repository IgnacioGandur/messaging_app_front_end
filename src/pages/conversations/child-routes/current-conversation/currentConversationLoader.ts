import type { LoaderFunctionArgs } from "react-router";

export default async function currentConversationLoader({ params }: LoaderFunctionArgs) {
    try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const url = `${import.meta.env.VITE_API_BASE}/conversations/${params.conversationId}`;
        const options: RequestInit = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        };

        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        return {
            error: true,
            message: "Server error. We were not able to load the current conversation.",
        }
    }
}
