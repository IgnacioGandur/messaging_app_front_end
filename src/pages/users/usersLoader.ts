import type { LoaderFunctionArgs } from "react-router";

export default async function usersLoader({ request }: LoaderFunctionArgs) {
    try {
        const url = new URL(request.url);
        const page = url.searchParams.get("page") || 1;
        const search = url.searchParams.get("search") || "";

        const usersUrl = new URL(`${import.meta.env.VITE_API_BASE}/users`);

        // Build the users back-end url.
        usersUrl.searchParams.set("page", String(page));
        if (search) usersUrl.searchParams.set("search", search);

        const friendshipsUrl = import.meta.env.VITE_API_BASE + "/friendships";
        const options: RequestInit = {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        };

        const usersResponse = await fetch(usersUrl.href, options);
        const friendshipsResponse = await fetch(friendshipsUrl, options);

        const usersResult = await usersResponse.json();
        const friendshipsResult = await friendshipsResponse.json();

        return {
            users: usersResult?.data.users,
            meta: usersResult?.data.meta,
            friendships: friendshipsResult?.friendships
        };
    } catch (error) {
        return {
            error: true,
            message: "Server error. We were not able to load the users."
        }
    }
}
