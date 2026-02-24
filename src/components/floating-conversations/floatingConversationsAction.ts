import type { ActionFunctionArgs } from "react-router";

const floatingConversationsAction = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const url = `${import.meta.env.VITE_API_BASE}/conversations/${data.conversationId}/messages`;
    const options: RequestInit = {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    };

    const response = await fetch(url, options);
    const result = await response.json();

    return result;
}

export default floatingConversationsAction;
