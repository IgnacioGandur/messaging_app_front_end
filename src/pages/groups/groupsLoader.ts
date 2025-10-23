export default async function groupsLoader() {
    try {
        const url = import.meta.env.VITE_API_BASE + `/groups`;
        const options: RequestInit = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };

        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        return {
            error: true,
            message: "Server error. We were not able to retrieve the groups.",
        }
    }
}
