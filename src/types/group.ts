import type Participant from "./participant";

export default interface Group {
    profilePicture: string;
    description: string;
    createdAt: Date;
    id: number;
    isGroup: boolean;
    participants: Participant[];
    title: string;
    _count: {
        participants: number;
    };
};
