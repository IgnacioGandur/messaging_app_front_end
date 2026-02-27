import { useEffect } from "react";
import { useFetcher } from "react-router";
import type Friendship from "../../../types/friendship";

interface ApiResponse {
    success: boolean;
    message: string;
    friendshipRequests: Friendship[];
};

const useFriendshipRequests = () => {
    const fetcher = useFetcher<ApiResponse>();

    useEffect(() => {
        fetcher.load("/get-friendship-requests");
    }, []);

    const requests = fetcher.data?.friendshipRequests;
    const isLoading = fetcher.state !== "idle";
    const error = !!(fetcher.data && fetcher.data.success === false)
        ? "We were not able to fetch your friendship requests."
        : null;

    return {
        requests,
        isLoading,
        error,
    };
};

export default useFriendshipRequests;
