import type { ActionFunctionArgs } from "react-router"

export default async function groupsAction({ request }: ActionFunctionArgs) {
    try {
        const formData = await request.formData();
        const intent = formData.get("intent");
        const url = import.meta.env.VITE_API_BASE + `/groups`;

        await new Promise((resolve) => setTimeout(resolve, 2000));
        if (intent === "create-group") {
            const title = formData.get("title");
            const description = formData.get("description");
            const options: RequestInit = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    title,
                    description
                })
            };

            const response = await fetch(url, options);
            const result = await response.json();
            return result;
        }

        if (intent === "join-group") {
            const groupId = formData.get("groupId");
            const joinGroupUrl = url + `/${groupId}`;
            const options: RequestInit = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            };

            const response = await fetch(joinGroupUrl, options);
            const result = await response.json();
            return result;
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
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            };

            const response = await fetch(leaveGroupUrl, options);
            const result = await response.json();
            return result;
        }
    } catch (error) {
        return {
            error: true,
        }
    }
}
