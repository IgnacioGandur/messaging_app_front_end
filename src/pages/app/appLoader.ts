export default async function appLoader() {
    try {
        const url = import.meta.env.VITE_API_BASE;
        const options: RequestInit = {
            method: "GET",
            credentials: "include",
            mode: "cors"
        };

        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        return {
            error: true,
            message: "We were not able to reach the backend. The app will not work correctly.",
        }
    }
}
