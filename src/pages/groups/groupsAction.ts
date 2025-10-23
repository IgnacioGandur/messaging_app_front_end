import type { ActionFunctionArgs } from "react-router"

export default async function groupsAction({ request }: ActionFunctionArgs) {
    try {
        const formData = await request.formData();
        const intent = formData.get("intent");
        const url = import.meta.env.VITE_API_BASE + `/groups`;

        await new Promise(resolve => setTimeout(resolve, 3000));
        if (intent === "create-group") {
            const groupName = formData.get("groupName");
            const options: RequestInit = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    groupName
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

    } catch (error) {
        return {
            error: true,
        }
    }
}
