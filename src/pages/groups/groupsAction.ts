import type { ActionFunctionArgs } from "react-router"
import apiRequest from "../../utils/apiRequest";

export default async function groupsAction({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const intent = formData.get("intent");
    const url = import.meta.env.VITE_API_BASE + `/groups`;

    await new Promise((resolve) => setTimeout(resolve, 2000));
    if (intent === "create-group") {
        const data = Object.fromEntries(formData);
        const options: RequestInit = {
            method: "POST",
            body: JSON.stringify(data),
        };

        return await apiRequest(url, options);
    }

    if (intent === "join-group") {
        const groupId = formData.get("groupId");
        const joinGroupUrl = url + `/${groupId}`;
        const options: RequestInit = {
            method: "POST",
        };

        return await apiRequest(joinGroupUrl, options);
    }

    if (intent === "leave-group") {
        const groupId = formData.get("groupId");
        const userId = formData.get("userId");
        const leaveGroupUrl = `${url}/${groupId}/participants`;
        const options: RequestInit = {
            method: "DELETE",
            body: JSON.stringify({
                userId,
            }),
        };

        return await apiRequest(leaveGroupUrl, options);
    }
}
