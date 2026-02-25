import toast from "react-hot-toast";
import type Group from "../types/group";
import type User from "../types/user";
import apiRequest from "./apiRequest";
import uploadFileToSupabase from "./uploadFileToSupabase";

const baseOptions: RequestInit = {
    credentials: "include",
    headers: {
        "Content-Type": "application/json"
    },
};

type ApiResponse = {
    success: boolean;
    message: string;
    user?: User;
    group?: Group;
};

export default async function updateProfilePictureAction(
    formData: FormData,
    bucketName: string,
    backendEndpoint: string,
) {
    const image = formData.get("profilePicture") as File;
    const imageUrl = formData.get("profilePictureUrl") as string;
    let profilePictureUrl = "";

    if (image && image.size > 0) {
        const fileSizeLimit = 3 * 1024 * 1024;

        if (image.size > fileSizeLimit) {
            return {
                error: true,
                message: "File too big. The profile picture should be less than 3 Megabytes."
            }
        };

        profilePictureUrl = await uploadFileToSupabase(
            image,
            bucketName,
            bucketName
        );
    } else if (imageUrl) {
        profilePictureUrl = imageUrl;
    } else {
        return {
            error: true,
            message: "No image provided.",
        };
    };

    const url = `${import.meta.env.VITE_API_BASE}/${backendEndpoint}`;
    const options: RequestInit = {
        ...baseOptions,
        method: "PUT",
        body: JSON.stringify({
            profilePictureUrl
        })
    };

    return apiRequest<ApiResponse>(url, options);
};
