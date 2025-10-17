import type { ActionFunctionArgs } from "react-router"

export default async function currentConversationAction({ request, params }: ActionFunctionArgs) {
    try {
        const formData = await request.formData();
        const intent = formData.get("intent");

        await new Promise(resolve => setTimeout(resolve, 3000));
        // Handle messages deletion.
        if (intent === "delete-message") {
            const messageId = formData.get("messageId");
            const url = import.meta.env.VITE_API_BASE + `/conversations/${params.conversationId}/messages/${messageId}`;

            const options: RequestInit = {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const response = await fetch(url, options);
            const result = await response.json();
            return {
                deletedMessage: result.success,
                message: result.message
            };
        }

        // Handle sending a message.
        const message = formData.get("message");
        const conversationId = params.conversationId;

        const url = import.meta.env.VITE_API_BASE + `/conversations/${conversationId}/messages`;
        const options: RequestInit = {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message,
                conversationId,
            }),
            credentials: "include",
        };

        const response = await fetch(url, options);
        const result = await response.json();
        return result;

    } catch (error) {
        return {
            error: true,
            message: "Server error. We were not able to send the message to the user.",
        }
    }
}
