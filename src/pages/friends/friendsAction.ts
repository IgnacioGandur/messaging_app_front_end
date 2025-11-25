import type { ActionFunctionArgs } from "react-router";

export default async function friendsAction({ request }: ActionFunctionArgs) {
    try {
        const formData = await request.formData();
        const friendshipId = formData.get("friendshipId");

        const url = import.meta.env.VITE_API_BASE + `/friendships/${friendshipId}`;
        const options: RequestInit = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
        };

        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        return {
            error: true,
            message: "Server error. We were not able to delete your friendship.",
        };
    }
};
