import type Conversation from "./conversation";
import type User from "./user";

export default interface Participant {
    role: "USER" | "ADMIN" | "OWNER";
    user: User;
    userId: number;
    joinedAt: Date;
    conversation: Conversation;
    listVisible: boolean;
    lastDeletedAt: Date;
};
