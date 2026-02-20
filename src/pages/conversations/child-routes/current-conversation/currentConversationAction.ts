import { toast } from "react-hot-toast";
import supabase from "../../../../supabase/supabase";
import { redirect, type ActionFunctionArgs } from "react-router"

export default async function currentConversationAction({ request, params }: ActionFunctionArgs) {
    const formData = await request.formData();
    const intent = formData.get("intent");
    const baseOptions: RequestInit = {
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include"
    }

    switch (intent) {
        case "delete-message": {
            const messageId = formData.get("messageId");
            const url = import.meta.env.VITE_API_BASE + `/conversations/${params.conversationId}/messages/${messageId}`;

            const options: RequestInit = {
                ...baseOptions,
                method: "DELETE",
            };

            const response = await fetch(url, options);
            const result = await response.json();
            return {
                deletedMessage: result.success,
                message: result.message
            };
        };

        case "toggle-admin-status": {
            const data = Object.fromEntries(formData);
            const url = import.meta.env.VITE_API_BASE + `/groups/${params.conversationId}/participants`;
            const options: RequestInit = {
                ...baseOptions,
                method: "PUT",
                body: JSON.stringify(data)
            };

            const response = await fetch(url, options);
            const result = await response.json();

            if (result.success) toast.success(result.message);

            return result;
        };

        case "remove-from-group": {
            const userId = formData.get("userId");
            const url = import.meta.env.VITE_API_BASE + `/groups/${params.conversationId}/participants`;
            const options: RequestInit = {
                ...baseOptions,
                method: "DELETE",
                body: JSON.stringify({
                    userId
                })
            };

            const response = await fetch(url, options);
            const result = await response.json();
            if (result.success) toast.success(result.message);
            return result;
        };

        case "update-group-info": {
            const data = Object.fromEntries(formData);
            const url = `${import.meta.env.VITE_API_BASE}/groups/${params.conversationId}`;
            const options: RequestInit = {
                ...baseOptions,
                method: "PATCH",
                body: JSON.stringify(data),
            };
            const response = await fetch(url, options);
            const result = await response.json();
            return result;
        };

        case "send-message": {
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
                    toast.error("Messages with attachments are not available at the moment.");
                    console.log(error.message);
                    return {
                        error: true,
                        message: "We were not able to send your attachment."
                    }
                } else {
                    const fileData = supabase.storage.from("attachments").getPublicUrl(data?.path);
                    const options: RequestInit = {
                        ...baseOptions,
                        method: "post",
                        body: JSON.stringify({
                            message,
                            conversationId,
                            file: attachment ? {
                                name: attachment.name,
                                type: attachment.type,
                                url: fileData.data.publicUrl
                            } : null
                        }),
                    };

                    const responseWithAttachment = await fetch(url, options);
                    const resultWithAttachment = await responseWithAttachment.json();
                    return resultWithAttachment;
                };
            };

            const options: RequestInit = {
                ...baseOptions,
                method: "post",
                body: JSON.stringify({
                    message,
                    conversationId,
                }),
            };

            const response = await fetch(url, options);
            const result = await response.json();
            return result;
        };

        case "leave-group": {
            const { conversationId } = params;
            const data = Object.fromEntries(formData);
            const url = `${import.meta.env.VITE_API_BASE}/groups/${conversationId}/participants`;
            const options: RequestInit = {
                method: "delete",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            };

            const response = await fetch(url, options);
            const result = await response.json();

            if (result.success) {
                return redirect("/groups");
            } else {
                return result;
            };
        };

        case "leave-private-conversation": {
            const { conversationId } = params;
            const url = `${import.meta.env.VITE_API_BASE}/conversations/${conversationId}/participants`;
            const options: RequestInit = {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const response = await fetch(url, options);
            const result = await response.json();

            if (result.success) toast.success("Conversation abandoned!");

            if (result.success) {
                return redirect("/conversations");
            } else {
                return result;
            };
        }
    };
}
