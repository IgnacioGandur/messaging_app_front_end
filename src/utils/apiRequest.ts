import { redirect } from "react-router";

export default async function apiRequest<T>(
    url: string,
    options?: RequestInit
): Promise<T> {
    const requestedPath = window.location.pathname;
    const defaultOptions: RequestInit = {
        ...options,
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    }

    const response = await fetch(url, defaultOptions);

    if (response.status === 401) {
        throw redirect("/login?message=" + encodeURIComponent(`The route you are trying to access: "${requestedPath}" is for logged users only.`));
    }

    if (response.status >= 400 && response.status <= 499) {
        return await response.json();
    }

    if (response.status >= 500) {
        throw response;
    }

    return await response.json();
}
