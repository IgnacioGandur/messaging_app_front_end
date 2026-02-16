import apiRequestLoader from "../../../utils/apiRequestLoader";
import type { ActionFunctionArgs } from "react-router";
import type User from "../../../types/user";
import type Friendship from "../../../types/friendship";
import type Group from "../../../types/group";

export interface CurrentUserResponseType {
    success: boolean;
    message: string;
    data: {
        user: User;
        ownedGroups: Group[];
        friendships: Friendship[];
        joinedGroups: Group[];
    }
}

export default async function userProfileLoader({ params }: ActionFunctionArgs) {
    const userId = params.id;
    const url = import.meta.env.VITE_API_BASE + "/users/" + userId;

    return await apiRequestLoader<CurrentUserResponseType>(url);
}
