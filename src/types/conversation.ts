import type Message from "./message.ts";
import type Participant from "./participant.ts";

export default interface Conversation {
    id: number;
    createdAt: Date;
    isGroup: boolean;
    messages: Message[];
    participants: Participant[];
    title?: string;
    profilePicture?: string;
    description: string;
}
