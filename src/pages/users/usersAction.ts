import { redirect, type ActionFunctionArgs } from "react-router"

export default async function usersAction({ request }: ActionFunctionArgs) {
    try {
        const formData = await request.formData();
        const message = formData.get("message");
        const recipientId = formData.get("recipientId");
        const url = import.meta.env.VITE_API_BASE + "/conversations";
        const options: RequestInit = {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                message,
                recipientId
            }),
        };

        const response = await fetch(url, options);
        const result = await response.json();

        if (result?.success) {
            return redirect(`/conversations/${result.conversation.id}`);
        } else {
            return result;
        }
    } catch (error) {
        return {
            error: true,
            message: "Server error. We were not able create the conversation.",
        }
    }
}
