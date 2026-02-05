import type Participant from "./participant";
import type Message from "./message";

export default interface Group {
    profilePicture: string;
    description: string;
    createdAt: Date;
    id: number;
    isGroup: boolean;
    participants: Participant[];
    messages: Message[];
    title: string;
    _count: {
        participants: number;
    };
};
