import { useFetcher } from "react-router";
import type Friendship from "../../../types/friendship";
import type User from "../../../types/user";
import styles from "./SingleFriend.module.css";
import { NavLink } from "react-router";
import { format } from "date-fns";
import SendMessageButton from "../../../mini-components/send-message-button/SendMessageButton";
import FriendshipRequestButton from "../../../mini-components/friendship-request-button/FriendshipRequestButton";

interface SingleFriendProps {
    user: User;
    friendship: Friendship;
    deleteFriendship: (friendshipId: number) => void;
};

const SingleFriend = ({
    user,
    friendship,
    deleteFriendship,
}: SingleFriendProps) => {
    const fetcher = useFetcher({ key: "friends-fetcher" });

    const isSubmitting = fetcher.state !== "idle";
    const isThisFriendship = fetcher.formData?.get("friendshipId")?.toString() === String(friendship.id);
    const isRemovingFriendship = isSubmitting && isThisFriendship;

    return <li
        key={friendship.id}
        className={styles.friend}
    >
        <NavLink
            viewTransition
            to={`/users/${user.id}`}
            className={styles["name-wrapper"]}
        >
            <h2
                className={styles.name}
            >
                {user.firstName} {user.lastName}
            </h2>
        </NavLink>
        <p className={styles["friends-since"]}>
            Friends since {format(friendship.createdAt, "MMMM do, yyyy")}
        </p>
        <span className={styles.username}>
            @{user.username}
        </span>
        <img
            src={user.profilePictureUrl}
            alt={`${user.username}'s profile picture.`}
            className={styles.ppf}
        />
        <div className={styles.buttons}>
            <FriendshipRequestButton
                isSubmitting={isRemovingFriendship}
                hasFriendshipRequestFromThisUser={undefined}
                name={`${user.firstName} ${user.lastName}`}
                acceptFriendshipRequest={() => undefined}
                friendship={friendship}
                cancelFriendship={() => deleteFriendship(friendship.id)}
                sendFriendshipRequest={() => undefined}
                popoverTargetId={`friendship-${friendship.id}`}
                anchorName={`--friendship-${friendship.id}`}
            />
            <SendMessageButton
                anchorName={`--message-anchor-${user.id}`}
                popoverTarget={`message-anchor-${user.id}`}
                incluceMessageRecipientId={true}
                messageRecipientId={user.id}
            />
        </div>
    </li>
};

export default SingleFriend;
