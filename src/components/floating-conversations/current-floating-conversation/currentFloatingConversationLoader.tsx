import type { LoaderFunctionArgs } from "react-router";

const currentFloatingConversationLoader = async ({ params }: LoaderFunctionArgs) => {
    const url = `${import.meta.env.VITE_API_BASE}/conversations/${params.id}`;
    const options: RequestInit = {
        method: "GET",
        credentials: "include",
    };

    const response = await fetch(url, options);
    return await response.json();
};

export default currentFloatingConversationLoader;
