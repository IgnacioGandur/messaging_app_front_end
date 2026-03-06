import socket from "../../socket";
import { useState, useEffect } from "react";
import type Conversation from "../../types/conversation";

const useConversations = (conversations: Conversation[]) => {
    const [updatedConversations, setUpdatedConversations] = useState<Conversation[]>(conversations);

    useEffect(() => {
        const updateConversation = (payload: Conversation) => {
            setUpdatedConversations((prev) => {
                const updatedArr = prev.filter(c => c.id !== payload.id);

                return [
                    payload,
                    ...updatedArr
                ];
            });
        };

        socket.on("conversations:update_conversation", updateConversation);

        return () => {
            socket.off("conversations:update_conversation", updateConversation);
        };
    }, []);

    return {
        updatedConversations,
    };
};

export default useConversations;
