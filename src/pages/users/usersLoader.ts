import apiRequestLoader from "../../utils/apiRequestLoader";

// Types
import type { LoaderFunctionArgs } from "react-router";
import type User from "../../types/user";
import type Friendship from "../../types/friendship";

export interface UsersResponse {
    success: boolean;
    message: string;
    data: {
        users: User[];
        meta: {
            totalCount: number;
            totalPages: number;
            currentPage: number;
        }
    }
}

interface FriendshipsResponse {
    success: boolean;
    message: string;
    friendships: Friendship[]
}

export default async function usersLoader({ request }: LoaderFunctionArgs) {
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

    const usersResult = await apiRequestLoader<UsersResponse>(usersUrl.href, options);
    const friendshipsResult = await apiRequestLoader<FriendshipsResponse>(friendshipsUrl, options);

    return {
        users: usersResult?.data.users,
        meta: usersResult?.data.meta,
        friendships: friendshipsResult?.friendships
    };
}
