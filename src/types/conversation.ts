import type Message from "./message.ts";
import type User from "./user.ts";

export default interface Conversation {
    id: number;
    createdAt: Date;
    isGroup: boolean;
    messages: Message[];
    participants: {
        user: User
    }[];
    title?: string;
    profilePicture?: string;
    description: string;
}
