import type User from "./user.ts";

export default interface Friendship {
    id: number;
    userAId: number;
    userBId: number;
    createdAt: Date;
    status: string;
    userA: User;
    userB: User;
}
