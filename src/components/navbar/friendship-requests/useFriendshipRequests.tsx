import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import type Friendship from "../../../types/friendship";
import socket from "../../../socket";
import toast from "react-hot-toast";
import Notification from "../../../mini-components/notification/Notification";

interface ApiResponse {
    success: boolean;
    message: string;
    friendshipRequests: Friendship[];
};

const useFriendshipRequests = () => {
    const requestsRef = useRef<Friendship[]>([]);
    const fetcher = useFetcher<ApiResponse>();
    const [requests, setRequests] = useState<Friendship[]>([]);

    useEffect(() => {
        requestsRef.current = requests;
    }, [requests]);

    useEffect(() => {
        fetcher.load("/get-friendship-requests");
    }, []);

    useEffect(() => {
        if (fetcher.data?.success && fetcher.data?.friendshipRequests) {
            setRequests(fetcher.data.friendshipRequests);
        };
    }, [fetcher.data]);

    useEffect(() => {
        const handleReceivedRequest = (payload: Friendship) => {
            const alreadyExists = requestsRef.current.some(r => r.userAId === payload.userAId);

            if (!alreadyExists) {
                toast.custom(<Notification icon="handshake" message="You have a new friendship request!" />);
                setRequests((prev) => [payload, ...prev]);
            };
        };

        const handleFriendshipCancel = (payload: Friendship) => {
            const { id } = payload;
            setRequests((prev) => prev.filter(r => r.id !== id));
        };

        const handleAcceptedFriendship = (payload: Friendship) => {
            const name = payload.userB?.firstName + " " + payload.userB?.lastName;

            toast.custom(<Notification
                icon="handshake"
                message={`${name} accepted you request!`}
            />);
        };

        socket.on("friendship:received_request", handleReceivedRequest);
        socket.on("friendship:cancel", handleFriendshipCancel);
        socket.on("friendship:request_accepted", handleAcceptedFriendship);

        return () => {
            socket.off("friendship:received_request", handleReceivedRequest);
            socket.off("friendship:cancel", handleFriendshipCancel);
            socket.off("friendship:request_accepted", handleAcceptedFriendship);
        };
    }, []);

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
