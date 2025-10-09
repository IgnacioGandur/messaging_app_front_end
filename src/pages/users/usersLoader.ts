export default async function usersLoader() {
    try {
        const url = import.meta.env.VITE_API_BASE + "/users";
        const options: RequestInit = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };

        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        return {
            error: true,
            message: "Server error. We were not able to load the users."
        }
    }
}
