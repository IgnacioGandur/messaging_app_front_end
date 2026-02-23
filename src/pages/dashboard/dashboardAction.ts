import apiRequest from "../../utils/apiRequest";
import toast from "react-hot-toast";
import updateProfilePictureAction from "../../utils/updateProfilePictureAction";

import type User from "../../types/user";
import type { ActionFunctionArgs } from "react-router";

interface ApiResponse {
    success: boolean;
    message: string;
    user: User;
}

export default async function dashboardAction({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const intent = formData.get("intent");
    const url = `${import.meta.env.VITE_API_BASE}/me`;
    const baseOptions: RequestInit = {
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    };

    let result: ApiResponse;

    switch (intent) {
        case "update-profile-picture": {
            result = await updateProfilePictureAction(
                formData,
                "avatars",
                "me"
            ) as ApiResponse;
            break;
        };

        case "update-profile-info": {
            const options: RequestInit = {
                ...baseOptions,
                method: "PATCH",
                body: JSON.stringify(data),
            };

            result = await apiRequest(url, options);
            break;
        }

        default: throw "No intent selected!";
    }

    if (result?.success) {
        toast.success(result.message);
    } else {
        toast.error(result.message);
    }

    return result;
};
