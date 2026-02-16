import styles from "./UserProfile.module.css";
import {
    useLoaderData,
    useParams,
    useRouteLoaderData
} from "react-router";

import UserInfoSection from "./user-info-section/UserInfoSection";
import FriendsSection from "./friends-section/FriendsSection";
import GroupsSection from "./groups-section/GroupsSection";

import type { CurrentUserResponseType } from "./userProfileLoader";
import type RootLoaderDataProps from "../../../types/rootLoaderData";

const UserProfile = () => {
    const rootLoaderData = useRouteLoaderData("root") as RootLoaderDataProps;
    const loggedUser = rootLoaderData.user;
    const loaderData = useLoaderData() as CurrentUserResponseType;

    const params = useParams();
    const user = loaderData?.data.user;
    const name = user.firstName + " " + user.lastName;

    const friends = loaderData.data.friendships
        .filter(f => f.status === "ACCEPTED")
        .map(f =>
            f.userAId === Number(params.id)
                ? f.userB
                : f.userA);
    const friendship = loaderData.data.friendships.find(f =>
        f.userAId === loggedUser?.id
        || f.userBId === loggedUser?.id);
    const ownedGroups = loaderData.data.ownedGroups;
    const joinedGroups = loaderData.data.joinedGroups;
    const isYou = rootLoaderData?.user?.id === user.id;

    return <main className={styles["user-profile"]}>
        <header
            className={styles.header}
        >
            <span className={`material-symbols-rounded ${styles.icon}`}>
                account_circle
            </span>
            <h1
                className={styles.title}
            >
                User Profile
            </h1>
        </header>
        <UserInfoSection
            friendship={friendship}
            isYou={isYou}
            user={user}
            name={name}
        />
        <FriendsSection
            friends={friends}
        />
        <GroupsSection
            gridArea="owned-groups"
            headerTitle="Owned"
            groups={ownedGroups}
            user={user}
        />
        <GroupsSection
            gridArea="joined-groups"
            headerTitle="Joined"
            groups={joinedGroups}
            user={user}
        />
    </main>
}

export default UserProfile;
