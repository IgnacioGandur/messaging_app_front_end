import type { LoaderFunctionArgs } from "react-router";
import apiRequest from "../../utils/apiRequest";
import type Conversation from "../../types/conversation";

interface Result {
    message: string;
    success: boolean;
    data: {
        conversations: Conversation[],
        count: number
    }
};

export default async function conversationsLoader({ request }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const conversationsUrl = new URL(import.meta.env.VITE_API_BASE + "/conversations");

    if (search) conversationsUrl.searchParams.set("search", search);

    const options: RequestInit = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    };

    return await apiRequest<Result>(conversationsUrl.href, options);
}
