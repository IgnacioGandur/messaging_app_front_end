export default async function conversationsLoader() {
    try {
        const url = import.meta.env.VITE_API_BASE + "/conversations";
        const options: RequestInit = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        };

        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        return {
            error: true,
            message: "Server error. We were not able to get your conversations.",
        }
    }
}
