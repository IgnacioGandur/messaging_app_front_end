import type { ActionFunctionArgs } from "react-router";

export default async function userProfileLoader({ params }: ActionFunctionArgs) {
    try {
        const userId = params.id;
        const url = import.meta.env.VITE_API_BASE + "/users/" + userId;
        const options: RequestInit = {
            method: "GET",
            headers: {
                "Content-Type": "appliaction/json"
            },
        };

        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Fetch error:", error);
        return {
            error: true,
            message: "Server error. We were not able to retrieve the user's profile.",
        }
    }
}
