import type { LoaderFunctionArgs } from "react-router";

export default async function conversationsLoader({ request }: LoaderFunctionArgs) {
    try {
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

        const response = await fetch(conversationsUrl.href, options);
        const result = await response.json();
        return result;
    } catch (error) {
        return {
            error: true,
            message: "Server error. We were not able to get your conversations.",
        }
    }
}
