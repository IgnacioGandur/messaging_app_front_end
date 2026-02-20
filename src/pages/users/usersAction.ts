import { redirect, type ActionFunctionArgs } from "react-router"
import apiRequest from "../../utils/apiRequest";
import type Conversation from "../../types/conversation";

interface ResponseType {
    success: boolean;
    message: string;
    conversation: Conversation;
}

export default async function usersAction({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const intent = formData.get("intent");

    if (intent === "send-friendship-request") {
        const userBId = formData.get("userBId");
        const url = import.meta.env.VITE_API_BASE + "/friendships";
        const options: RequestInit = {
            method: "POST",
            body: JSON.stringify({
                userBId,
            }),
        };

        return await apiRequest(url, options);
    };

    if (intent === "cancel-friendship-request") {
        const friendshipId = formData.get("friendshipId");
        const url = import.meta.env.VITE_API_BASE + `/friendships/${friendshipId}`;
        const options: RequestInit = {
            method: "DELETE",
        };

        return await apiRequest(url, options);
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

        return await apiRequest(url, options);
    }

    if (intent === "send-message") {
        const data = Object.fromEntries(formData);
        const url = import.meta.env.VITE_API_BASE + "/conversations";
        const options: RequestInit = {
            method: "POST",
            body: JSON.stringify(data),
        };

        const result = await apiRequest<ResponseType>(url, options);

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

        return await apiRequest(url, options);
    }
}
