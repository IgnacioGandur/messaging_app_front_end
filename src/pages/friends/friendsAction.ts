import { redirect } from "react-router";
import type { ActionFunctionArgs } from "react-router";

export default async function friendsAction({ request }: ActionFunctionArgs) {
    try {
        const formData = await request.formData();
        const intent = formData.get("intent");
        const friendshipId = formData.get("friendshipId");

        if (intent === "remove-friend") {
            const url = import.meta.env.VITE_API_BASE + `/friendships/${friendshipId}`;
            const options: RequestInit = {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
            };

            const response = await fetch(url, options);
            const result = await response.json();
            return result;
        }

        if (intent === "send-message") {
            const message = formData.get("message");
            const recipientId = formData.get("recipientId");
            const url = import.meta.env.VITE_API_BASE + "/conversations";
            const options: RequestInit = {
                method: "POST",
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
        }
    } catch (error) {
        return {
            error: true,
            message: "Server error. We were not able to delete your friendship.",
        };
    }
};
