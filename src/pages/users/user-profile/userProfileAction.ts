import { redirect } from "react-router";
import apiRequest from "../../../utils/apiRequest";

import type Conversation from "../../../types/conversation";
import type { ActionFunctionArgs } from "react-router";

interface MessageResponseType {
    success: boolean;
    message: string;
    conversation: Conversation;
};

const userProfileAction = async ({ request, params }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const intent = formData.get("intent");

    if (intent === "send-message") {
        const recipientId = params.id;
        const message = formData.get("message");
        const url = `${import.meta.env.VITE_API_BASE}/conversations`;
        const options: RequestInit = {
            method: "post",
            body: JSON.stringify({
                message,
                recipientId
            }),
        };

        const result = await apiRequest<MessageResponseType>(url, options);
        if (result.success) {
            return redirect(`/conversations/${result.conversation.id}`);
        } else {
            return result;
        }
    }

    if (intent === "send-friendship-request") {
        const userBId = formData.get("userBId");
        const url = `${import.meta.env.VITE_API_BASE}/friendships`;
        const options: RequestInit = {
            method: "post",
            body: JSON.stringify({
                userBId
            }),
        };

        await apiRequest(url, options);
    }

    if (intent === "cancel-friendship") {
        const friendshipId = formData.get("friendshipId");
        const url = `${import.meta.env.VITE_API_BASE}/friendships/${friendshipId}`;
        const options: RequestInit = {
            method: "delete",
        };

        await apiRequest(url, options);
    }

    if (intent === "accept-friendship-request") {
        const friendshipId = formData.get("friendshipId");
        const status = formData.get("status");
        const url = `${import.meta.env.VITE_API_BASE}/friendships/${friendshipId}`;
        const options: RequestInit = {
            method: "put",
            body: JSON.stringify({ status })
        };

        await apiRequest(url, options);
    }
};

export default userProfileAction;
