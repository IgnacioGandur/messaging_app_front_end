import type Attachment from "./attachment.ts";
import type User from "./user.ts";

export default interface Message {
    id: number;
    senderId: number;
    sender: User;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    deleted: boolean;
    attachments: Attachment[];
};
