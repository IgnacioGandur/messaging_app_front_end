export default async function logoutLoader() {
    try {
        const url = import.meta.env.VITE_API_BASE + "/auth/logout";
        const options: RequestInit = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        };

        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        return {
            error: true,
            message: "Server error. We were not able to log you out.",
        }
    }
} 
