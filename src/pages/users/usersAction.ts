import { redirect, type ActionFunctionArgs } from "react-router"
import apiRequest from "../../utils/apiRequest";
import type Conversation from "../../types/conversation";
import socket from "../../socket";
import type Friendship from "../../types/friendship";

interface ResponseType {
    success: boolean;
    message: string;
    conversation: Conversation;
}

interface FriendshipRequestType extends Omit<ResponseType, "conversation"> {
    friendship: Friendship;
};

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

        const result = await apiRequest<FriendshipRequestType>(url, options);

        if (result.success) {
            socket.emit("friendship:send_request", { userBId, friendship: result.friendship });
        };

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

        const result = await apiRequest<FriendshipRequestType>(url, options);

        if (result.success) {
            socket.emit(`friendship:${status === "ACCEPTED" ? "accept" : "cancel_request"}`, result.friendship);
        };

        return result;
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

        const result = await apiRequest<FriendshipRequestType>(url, options);

        if (result.success) {
            socket.emit("friendship:remove", result.friendship);
        };

        return result;
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
}
