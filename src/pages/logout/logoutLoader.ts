import apiRequest from "../../utils/apiRequest";

export default async function logoutLoader() {
    const url = import.meta.env.VITE_API_BASE + "/auth/logout";
    const options: RequestInit = {
        method: "GET",
    };

    return await apiRequest(url, options);
} 
