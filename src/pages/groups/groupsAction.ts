import type { ActionFunctionArgs } from "react-router"

export default async function groupsAction({ request }: ActionFunctionArgs) {
    try {
        const formData = await request.formData();
        const intent = formData.get("intent");

        if (intent === "create-group") {
            const groupName = formData.get("groupName");
            const url = import.meta.env.VITE_API_BASE + `/conversations`;
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

        return {};

    } catch (error) {
        return {
            error: true,
        }
    }
}
