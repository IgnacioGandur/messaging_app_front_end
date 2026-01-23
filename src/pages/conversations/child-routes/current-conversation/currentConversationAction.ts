import supabase from "../../../../supabase/supabase";
import type { ActionFunctionArgs } from "react-router"

export default async function currentConversationAction({ request, params }: ActionFunctionArgs) {
    try {
        const formData = await request.formData();
        const intent = formData.get("intent");

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

        // Toggle ADMIN role.
        if (intent === "toggle-admin-status") {
            const userId = formData.get("userId");
            const role = formData.get("role");
            const url = import.meta.env.VITE_API_BASE + `/groups/${params.conversationId}/participants`;
            const options: RequestInit = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    userId,
                    role
                })
            };

            const response = await fetch(url, options);
            const result = await response.json();
            return result;
        }

        if (intent === "remove-from-group") {
            const userId = formData.get("userId");
            const url = import.meta.env.VITE_API_BASE + `/groups/${params.conversationId}/participants`;
            const options: RequestInit = {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    userId
                })
            };

            const response = await fetch(url, options);
            const result = await response.json();
            return result;
        }

        if (intent === "update-group-info") {
            const title = formData.get("title");
            const ppf = formData.get("ppf");
            const description = formData.get("description");
            const url = `${import.meta.env.VITE_API_BASE}/groups/${params.conversationId}`;
            const options: RequestInit = {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    title,
                    ppf,
                    description
                })
            };
            const response = await fetch(url, options);
            const result = await response.json();
            return result;
        };

        // Handle sending a message.
        if (intent === "send-message") {
            const message = formData.get("message");
            const conversationId = params.conversationId;
            const attachment = formData.get("attachment") as File | null;
            const url = import.meta.env.VITE_API_BASE + `/conversations/${conversationId}/messages`;

            // This means empty input file.
            // if (attachment?.type !== "application/octet-stream") {
            if (attachment instanceof File && attachment.size > 0) {
                const { data, error } = await supabase.storage
                    .from("attachments")
                    .upload(`conversations/${conversationId}/${Date.now()}-${attachment?.name}`, attachment);


                if (error) {
                    console.log(error);
                    return {
                        error: true,
                        message: "We were not able to send your attachment."
                    }
                } else {
                    const fileData = supabase.storage.from("attachments").getPublicUrl(data?.path);
                    const options: RequestInit = {
                        method: "post",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            message,
                            conversationId,
                            file: attachment ? {
                                name: attachment.name,
                                type: attachment.type,
                                url: fileData.data.publicUrl
                            } : null
                        }),
                        credentials: "include",
                    };

                    const responseWithAttachment = await fetch(url, options);
                    const resultWithAttachment = await responseWithAttachment.json();
                    return resultWithAttachment;
                };
            };

            const options: RequestInit = {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    message,
                    conversationId,
                }),
            };

            const response = await fetch(url, options);
            const result = await response.json();
            return result;
        }
    } catch (error) {
        return {
            error: true,
            message: "Server error. We were not able to send the message to the user.",
        }
    }
}
