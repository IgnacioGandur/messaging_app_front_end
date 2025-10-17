export default interface Message {
    id: number;
    senderId: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    deleted: boolean;
};
