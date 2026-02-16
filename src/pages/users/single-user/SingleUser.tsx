import styles from "./SingleUser.module.css";

// Packages
import { useState } from "react";
import {
    NavLink,
    useRouteLoaderData,
    useFetcher
} from "react-router";

// Types
import type User from "../../../types/user";
import type Friendship from "../../../types/friendship";

// Components
import SendMessageButton from "../../../mini-components/send-message-button/SendMessageButton";
import FriendshipRequestButton from "../../../mini-components/friendship-request-button/FriendshipRequestButton";

interface SingleUserProps {
    user: User;
    friendships: Friendship[];
    removeFriendship: (friendshipId: number) => void;
    handleFriendshipResponse: (
        friendshipId: number,
        status: "PENDING" | "ACCEPTED" | "REJECTED",
    ) => void;
    sendFriendshipRequest: (userBId: number) => void;
};

const SingleUser = ({
    user,
    friendships,
    removeFriendship,
    handleFriendshipResponse,
    sendFriendshipRequest,
}: SingleUserProps) => {
    const fetcher = useFetcher({ key: "users-fetcher" });
    const loaderData = useRouteLoaderData("root") as {
        success: boolean;
        message: string;
        user: User;
    };
    const loggedUserId = loaderData.user.id;
    const isLoggedUser = user.id === loggedUserId;

    const [message, setMessage] = useState("");
    const handleMessage = (
        _: string,
        value: string,
    ) => {
        setMessage(value);
    };

    // Check if there's a friendship between the logged user and the rendered user, the friendship can have any status.
    const friendship = friendships.find((f) =>
        f.userAId === loggedUserId
        && f.userBId === user.id)
        || friendships.find((f) =>
            f.userBId === loggedUserId
            && f.userAId === user.id);

    // Check if the logged user has a friendship request from the rendered user.
    const wantsToBeYourFriend = friendships.find((f) =>
        f.userBId === loggedUserId
        && f.userAId === user.id)?.status === "PENDING";

    const isSubmitting = fetcher.state !== "idle";
    const isThisUser = fetcher.formData?.get("userBId") === String(user.id)
        || fetcher.formData?.get("friendshipId") === String(friendship?.id);

    const isHandlingFriendship = isSubmitting && isThisUser;

    return <li
        key={user.username}
        className={styles.user}
    >
        <NavLink
            to={"/users/" + user.id}
            className={styles["user-info"]}
        >
            <img
                src={user.profilePictureUrl}
                alt={`${user.username}'s profile picture.`}
                className={styles.ppf}
            />
            <p
                className={styles.name}
            >
                {user.firstName} {user.lastName}
            </p>
            <p
                className={styles.username}
            >
                @{user.username}
            </p>
        </NavLink>
        {isLoggedUser ? (
            <p className={styles.you}>(You)</p>
        ) : (
            <div
                className={styles.buttons}
            >
                <FriendshipRequestButton
                    isSubmitting={isHandlingFriendship}
                    hasFriendshipRequestFromThisUser={wantsToBeYourFriend}
                    name={`${user.firstName} ${user.lastName}`}
                    acceptFriendshipRequest={() => handleFriendshipResponse(friendship!.id, "ACCEPTED")}
                    cancelFriendship={() => removeFriendship(friendship!.id)}
                    sendFriendshipRequest={() => sendFriendshipRequest(user.id)}
                    friendship={friendship}
                    popoverTargetId={`handle-friendship-request-${user.id}`}
                    anchorName={`--handle-friendship-anchor-${user.id}`}
                />
                <SendMessageButton
                    message={message}
                    handleMessage={handleMessage}
                    anchorName={`--message-anchor-${user.id}`}
                    popoverTarget={`message-anchor-${user.id}`}
                    incluceMessageRecipientId={true}
                    messageRecipientId={user.id}
                />
            </div>
        )}
    </li>
};

export default SingleUser;
