import { redirect, type ActionFunctionArgs } from "react-router"

export default async function usersAction({ request }: ActionFunctionArgs) {
    try {
        const formData = await request.formData();
        const intent = formData.get("intent");

        if (intent === "send-friendship-request") {
            const userBId = formData.get("userBId");
            const url = import.meta.env.VITE_API_BASE + "/friendships";
            const options: RequestInit = {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userBId,
                }),
            };

            const response = await fetch(url, options);
            const result = await response.json();
            return result;
        };

        if (intent === "cancel-friendship-request") {
            const friendshipId = formData.get("friendshipId");
            const url = import.meta.env.VITE_API_BASE + `/friendships/${friendshipId}`;
            const options: RequestInit = {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const response = await fetch(url, options);
            const result = await response.json();
            return result;
        };

        if (intent === "handle-friendship-response") {
            const friendshipId = formData.get("friendshipId");
            const status = formData.get("status");
            const url = import.meta.env.VITE_API_BASE + `/friendships/${friendshipId}`;
            const options: RequestInit = {
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                method: status === "ACCEPTED" ? "PUT" : "DELETE",
                body: JSON.stringify({
                    status
                }),
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
                method: "GET",
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

        if (intent === "remove-friend") {
            const friendshipId = formData.get("friendshipId");
            const url = `${import.meta.env.VITE_API_BASE}/friendships/${friendshipId}`;
            const options: RequestInit = {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            };

            const response = await fetch(url, options);
            const result = await response.json();
            return result;
        }
    } catch (error) {
        return {
            error: true,
            message: "Server error. We were not able create the conversation.",
        }
    }
}
