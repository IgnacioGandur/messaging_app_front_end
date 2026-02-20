import apiRequest from "../../utils/apiRequest";

// Types
import type { ActionFunctionArgs } from "react-router";
import type InputError from "../../types/InputErrors";
import type User from "../../types/user";

export interface RegisterActionResponseType {
    success: boolean;
    message: string;
    errors?: InputError[]
    user?: User;
};

export default async function registerAction({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const url = import.meta.env.VITE_API_BASE + "/auth/register";
    const options: RequestInit = {
        method: "POST",
        cache: "no-store",
        body: JSON.stringify(data)
    };


    return await apiRequest<RegisterActionResponseType>(url, options);
}

