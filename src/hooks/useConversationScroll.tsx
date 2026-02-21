import { useRef, useCallback } from "react";

const useConversationScroll = () => {
    const anchorRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = useCallback(() => {
        if (anchorRef.current) {
            anchorRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, []);

    return {
        anchorRef,
        scrollToBottom
    };
};

export default useConversationScroll;
