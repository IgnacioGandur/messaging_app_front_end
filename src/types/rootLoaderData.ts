export default interface RootLoaderDataProps {
    success: boolean;
    message: string;
    user: {
        firstName: string;
        id: number;
        joinedOn: Date;
        profilePictureUrl: string;
        username: string;
    };
}
