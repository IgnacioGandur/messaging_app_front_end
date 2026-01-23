import type { ActionFunctionArgs } from "react-router";

export default async function loginAction({ request }: ActionFunctionArgs) {
    try {
        const formData = await request.formData();
        const username = formData.get("username");
        const password = formData.get("password");
        const url = import.meta.env.VITE_API_BASE + "/auth/login";
        const options: RequestInit = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                username,
                password
            })
        };

        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        return {
            error: true,
            message: "Server error. We were not able to log you in.",
        }
    }
}
