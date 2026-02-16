import type Friendship from "../../../types/friendship";
import type User from "../../../types/user";
import styles from "./SingleFriend.module.css";
import { NavLink } from "react-router";
import { format } from "date-fns";

interface SingleFriendProps {
    user: User;
    friendship: Friendship;
    deleteFriendship: (friendshipId: number) => void;
    onClick: () => void;
};

const SingleFriend = ({
    user,
    friendship,
    deleteFriendship,
    onClick
}: SingleFriendProps) => {
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
            <button
                onClick={() => {
                    deleteFriendship(friendship.id);
                }}
            >
                <span className={`material-symbols-rounded ${styles.icon}`}>
                    person_remove
                </span>
                <span className={styles.text}>
                    Remove friend
                </span>
            </button>
            <button
                onClick={onClick}
            >
                <span className={`material-symbols-rounded ${styles.icon}`}>
                    conversation
                </span>
                <span className={styles.text}>
                    Send message
                </span>
            </button>
        </div>
    </li>
};

export default SingleFriend;
