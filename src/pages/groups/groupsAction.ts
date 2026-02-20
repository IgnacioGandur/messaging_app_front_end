import apiRequest from "../../utils/apiRequest";
import { redirect } from "react-router";
import { toast } from "react-hot-toast";

import type { ActionFunctionArgs } from "react-router"
import type Group from "../../types/group";
import type Participant from "../../types/participant";

interface ApiResponse<Type> {
    success: boolean;
    message: string;
    group?: Type;
    participant?: Type;
};

export default async function groupsAction({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const intent = formData.get("intent");
    const url = import.meta.env.VITE_API_BASE + `/groups`;

    switch (intent) {
        case "create-group": {
            const data = Object.fromEntries(formData);
            const options: RequestInit = {
                method: "POST",
                body: JSON.stringify(data),
            };

            const result = await apiRequest(url, options) as ApiResponse<Group>;

            if (result.success) {
                toast.success("Group created!");
                return redirect(`/conversations/${result.group!.id}`);
            }

            return result;
        };

        case "join-group": {
            const groupId = formData.get("groupId");
            const joinGroupUrl = url + `/${groupId}`;
            const options: RequestInit = {
                method: "POST",
            };

            const result = await apiRequest(joinGroupUrl, options) as ApiResponse<Participant>;

            if (result.success) toast.success("Joined group!");

            return result;
        };

        case "leave-group": {
            const groupId = formData.get("groupId");
            const userId = formData.get("userId");
            const leaveGroupUrl = `${url}/${groupId}/participants`;
            const options: RequestInit = {
                method: "DELETE",
                body: JSON.stringify({
                    userId,
                }),
            };

            const result = await apiRequest(leaveGroupUrl, options) as ApiResponse<Group>;

            if (result.success) toast.success("Abandoned group!");

            return result;
        }
    }
}
