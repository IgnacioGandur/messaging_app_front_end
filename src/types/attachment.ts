export default interface Attachment {
    id: number;
    messageId: number;
    fileName: string;
    fileUrl: string;
    fileType: string;
    uploadedAt: Date;
}
