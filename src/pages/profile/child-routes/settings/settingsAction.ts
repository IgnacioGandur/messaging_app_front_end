import apiRequest from "../../../../utils/apiRequest";
import { redirect } from "react-router";
import type User from "../../../../types/user";
import type { ActionFunctionArgs } from "react-router";

// TODO: handle actions and responses.

interface ResponsesType {
    success: boolean;
    message: string;
    user: User;
}

export default async function settingsAction({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const intent = formData.get("intent");
    const url = import.meta.env.VITE_API_BASE + "/me";

    await new Promise((r) => setTimeout(r, 2000));
    if (intent === "delete-account") {
        const options: RequestInit = {
            method: "DELETE",
        };

        const result = await apiRequest<ResponsesType>(url, options);

        return result.success ? redirect("/") : {
            accountDeleted: true,
            message: result?.message
        };
    };

    if (intent === "update-profile") {
        const data = Object.fromEntries(formData);

        const options: RequestInit = {
            method: "PATCH",
            body: JSON.stringify(data),
        };

        return await apiRequest<ResponsesType>(url, options);
    }
}
