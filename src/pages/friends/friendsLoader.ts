export default async function friendsLoader() {
    try {
        const url = import.meta.env.VITE_API_BASE + "/friendships";
        const options: RequestInit = {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
        };

        const response = await fetch(url, options);
        console.log("The content of response is:", response);
        const result = await response.json();
        return result;
    } catch (error) {
        return {
            error: true,
            message: "Server error. We were not able to get your friends."
        }
    }
}
