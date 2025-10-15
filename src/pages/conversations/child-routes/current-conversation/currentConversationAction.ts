import type { ActionFunctionArgs } from "react-router"

export default async function currentConversationAction({ request, params }: ActionFunctionArgs) {
    try {
        const formData = await request.formData();
        const message = formData.get("message");
        const userId = params.userId;

        const url = import.meta.env.VITE_API_BASE + "/conversations";
        const options: RequestInit = {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message,
                recipientId: userId,
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
