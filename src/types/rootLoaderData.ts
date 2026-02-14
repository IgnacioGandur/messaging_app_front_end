import type User from "./user";

export default interface RootLoaderDataProps {
    success: boolean;
    message: string;
    user?: User;
}
