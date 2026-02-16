import type { LoaderFunctionArgs } from "react-router";
import apiRequestLoader from "../../utils/apiRequestLoader";

export default async function friendsLoader({ request }: LoaderFunctionArgs) {
    // Create a url object based on the current url.
    const url = new URL(request.url);
    const page = url.searchParams.get("page") || 1; // Get the current page or set it to 1.
    const search = url.searchParams.get("search") || ""; // Get current search value or set it to empty string.

    const friendsUrl = new URL(`${import.meta.env.VITE_API_BASE}/friendships`);

    // Build to final url.
    friendsUrl.searchParams.set("page", String(page));
    friendsUrl.searchParams.set("filter", "ACCEPTED");
    if (search) friendsUrl.searchParams.set("search", search);

    // const url = import.meta.env.VITE_API_BASE + "/friendships?filter=ACCEPTED&page=1";
    const options: RequestInit = {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
    };

    return await apiRequestLoader(friendsUrl.href, options);
}
