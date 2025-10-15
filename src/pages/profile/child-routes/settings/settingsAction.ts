import type { ActionFunctionArgs } from "react-router";

export default async function settingsAction({ request }: ActionFunctionArgs) {
    try {
        const formData = await request.formData();
        const intent = formData.get("intent");
        const userId = formData.get("userId");

        if (intent === "delete-account") {
            try {
                const url = import.meta.env.VITE_API_BASE + `/users/${userId}`;
                const options: RequestInit = {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                };

                const deleteAccountResponse = await fetch(url, options);
                const deleteAccountResult = await deleteAccountResponse.json();
                return {
                    accountDeleted: true,
                    message: deleteAccountResult?.message
                };
            } catch (error) {
                return {
                    error: true,
                    message: "Server error. We were not able to delete your account."
                };
            };
        };

        const profilePictureUrl = formData.get("profilePictureUrl");
        const firstName = formData.get("firstName");
        const lastName = formData.get("lastName");
        const password = formData.get("password");
        const confirmPassword = formData.get("confirmPassword");

        const meOptions: RequestInit = {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        };

        const meUrl = import.meta.env.VITE_API_BASE + "/me";
        const meResponse = await fetch(meUrl, meOptions);
        const meResult = await meResponse.json();

        const updateOptions: RequestInit = {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstName,
                lastName,
                profilePictureUrl,
                password,
                confirmPassword
            }),
        };

        const updateUrl = import.meta.env.VITE_API_BASE + `/users/${meResult?.user?.id}`;

        const updateResponse = await fetch(updateUrl, updateOptions);
        const updateResult = await updateResponse.json();
        return updateResult;
    } catch (error) {
        return {
            error: true,
            message: "Server error. We were not able to update your profile's info.",
        }
    }
}
