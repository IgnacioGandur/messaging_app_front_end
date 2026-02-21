import type User from "../../types/user.ts";
import apiRequestLoader from "../../utils/apiRequestLoader.ts";

interface ResponseType {
    success: boolean;
    message: string;
    user: User;
};

export default async function dashboardLoader() {
    const url = `${import.meta.env.VITE_API_BASE}/me?includeStats=true`;

    return await apiRequestLoader<ResponseType>(url);
};
