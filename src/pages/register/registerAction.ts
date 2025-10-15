import type { ActionFunctionArgs } from "react-router";

export default async function registerAction({ request }: ActionFunctionArgs) {
    try {
        const formData = await request.formData();
        const firstName = formData.get("firstName");
        const lastName = formData.get("lastName");
        const username = formData.get("username");
        const password = formData.get("password");
        const confirmPassword = formData.get("confirmPassword");
        const url = import.meta.env.VITE_API_BASE + "/auth/register";
        const options: RequestInit = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                firstName,
                lastName,
                username,
                password,
                confirmPassword
            })
        };

        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        return {
            success: true,
            message: "Server error. User registration failed.",
        }
    }
}

