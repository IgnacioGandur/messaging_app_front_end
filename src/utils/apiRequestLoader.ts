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

    let response;

    try {
        response = await fetch(url, defaultOptions);
    } catch (error) {
        throw new Response(JSON.stringify({
            success: false,
            message: "We were not able to reach the server.",
            errors: []
        }), { status: 503, statusText: "Server unavailable" })
    }

    if (response.status === 401) {
        throw redirect("/login?message=" + encodeURIComponent(`Access denied for: "${requestedPath}"`))
    }

    if (!response.ok) {
        const errorData = await response.json();
        throw new Response(JSON.stringify(errorData), {
            status: response.status,
            statusText: response.statusText,
        });
    }

    return await response.json();
}

