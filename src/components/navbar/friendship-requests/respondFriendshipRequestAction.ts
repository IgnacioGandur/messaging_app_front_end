import type { ActionFunctionArgs } from "react-router";
import socket from "../../../socket";

type Status = "ACCEPTED" | "REJECTED";

const respondFriendshipRequestAction = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const friendshipId = formData.get("friendshipId");
    const status = formData.get("status") as Status;

    const url = `${import.meta.env.VITE_API_BASE}/friendships/${friendshipId}`;

    const options: RequestInit = {
        method: status === "ACCEPTED" ? "PUT" : "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        ...(status === "ACCEPTED" && {
            body: JSON.stringify({
                status
            })
        })
    };

    const response = await fetch(url, options);
    const result = await response.json();

    if (result?.friendship?.status === "ACCEPTED") {
        socket.emit("friendship:accept", result.friendship);
    };

    return result;
};

export default respondFriendshipRequestAction;
