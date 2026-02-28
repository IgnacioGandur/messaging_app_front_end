import socket from "../../socket";
import { useState, useEffect } from "react";
import type Friendship from "../../types/friendship";

const useFriendshipsSocket = (friendships: Friendship[]) => {
    const [updatedFriendships, setUpdatedFriendships] = useState<Friendship[]>(friendships);

    useEffect(() => {
        setUpdatedFriendships(friendships);
    }, [friendships]);

    useEffect(() => {
        const replaceFriendshipStatus = (payload: Friendship) => {
            setUpdatedFriendships((prev) => {
                const newArr = prev.filter(f => f.id !== payload.id);
                const updated = [...newArr, payload];
                return updated;
            });
        };

        const cancelFriendship = (payload: Friendship) => {
            setUpdatedFriendships((prev) => prev.filter(f => f.id !== payload.id));
        };

        socket.on("friendship:received_request", replaceFriendshipStatus);
        socket.on("friendship:cancel", cancelFriendship);
        socket.on("friendship:request_accepted", replaceFriendshipStatus);
        socket.on("friendship:remove_friend", cancelFriendship);

        return () => {
            socket.off("friendship:received_request", replaceFriendshipStatus);
            socket.off("friendship:cancel", cancelFriendship);
            socket.off("friendship:request_accepted", replaceFriendshipStatus);
            socket.off("friendship:remove_friend", cancelFriendship);
        };
    }, []);

    return {
        updatedFriendships
    };
};

export default useFriendshipsSocket;
