export default interface Message {
    id: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    deleted: boolean;
};
