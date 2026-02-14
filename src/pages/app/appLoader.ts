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

    const response = await fetch(url, options);
    return await response.json();
}
