export default async function appLoader() {
    const url = import.meta.env.VITE_API_BASE + "/me";
    const options: RequestInit = {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        mode: "cors"
    };

    try {
        const response = await fetch(url, options);
        return await response.json();
    } catch (error) {
        return {
            error: true,
            message: "We’re having trouble connecting, most of the application will not work. Please try again later..."
        }
    }
}
