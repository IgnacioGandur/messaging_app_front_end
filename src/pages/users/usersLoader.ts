import type { LoaderFunctionArgs } from "react-router";

export default async function usersLoader({ request }: LoaderFunctionArgs) {
    try {
        const url = new URL(request.url);
        const page = url.searchParams.get("page") || 1;
        const usersUrl = import.meta.env.VITE_API_BASE + `/users?page=${page}`;
        const friendshipsUrl = import.meta.env.VITE_API_BASE + "/friendships";
        const options: RequestInit = {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        };

        const usersResponse = await fetch(usersUrl, options);
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
