import type { ActionFunctionArgs } from "react-router";
import apiRequest from "../../utils/apiRequest";
import type InputError from "../../types/InputErrors";
import type { User } from "@supabase/supabase-js";
import { redirect } from "react-router";

export interface LoginResponseType {
    success: boolean;
    message: string;
    errors?: InputError[];
    user?: User;
};

export default async function loginAction({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const url = import.meta.env.VITE_API_BASE + "/auth/login";
    const options: RequestInit = {
        method: "POST",
        body: JSON.stringify(data)
    };

    const result = await apiRequest<LoginResponseType>(url, options);

    if (result?.success) {
        return redirect("/");
    } else {
        return result;
    }
}
