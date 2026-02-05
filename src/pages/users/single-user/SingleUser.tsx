import { NavLink, useRouteLoaderData } from "react-router";
import styles from "./SingleUser.module.css";
import type User from "../../../types/user";
import type Friendship from "../../../types/friendship";

interface SingleUserProps {
    user: User;
    friendships: Friendship[];
    removeFriendship: (friendshipId: number) => void;
    handleFriendshipResponse: (
        friendshipId: number,
        status: "PENDING" | "ACCEPTED" | "REJECTED",
    ) => void;
    setCurrentTargetUser: React.Dispatch<React.SetStateAction<User | null>>;
    sendFriendshipRequest: (userBId: number) => void;
    setShowMessageModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const SingleUser = ({
    user,
    friendships,
    removeFriendship,
    handleFriendshipResponse,
    sendFriendshipRequest,
    setCurrentTargetUser,
    setShowMessageModal
}: SingleUserProps) => {
    const loaderData = useRouteLoaderData("root") as {
        success: boolean;
        message: string;
        user: User;
    };
    const loggedUserId = loaderData.user.id;

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
        {user.id === loggedUserId
            ? <p className={styles.you}>(You)</p>
            : (
                <div
                    className={styles.buttons}
                >
                    {(() => {
                        {/* These are the received friendship requests. */ }
                        const friendship = friendships.find((f) =>
                            f.userAId === loggedUserId && f.userBId === user.id
                        );

                        {/* These are the frienships requests sent by the logged user. */ }
                        const friendshipReverse = friendships.find((f) =>
                            f.userBId === loggedUserId && f.userAId === user.id
                        );

                        if (friendshipReverse) {
                            return friendshipReverse.status === "ACCEPTED" ? (
                                <>
                                    <span
                                        className={styles.text}
                                    >
                                        Already your friend
                                    </span>
                                    <button
                                        onClick={() => {
                                            removeFriendship(friendshipReverse.id);
                                        }}
                                    >
                                        <span
                                            className={styles.text}
                                        >
                                            Remove from friends
                                        </span>
                                        <span
                                            className="material-symbols-rounded"
                                        >
                                            person_remove
                                        </span>
                                    </button>
                                </>
                                // If the user received a friendship request, let the user respond to it.
                            ) : (<div className={styles["answer-friendship"]}>
                                <p className={styles.message}>
                                    Wants to be your friend
                                </p>
                                <div className={styles.buttons}>
                                    <button
                                        onClick={() => handleFriendshipResponse(
                                            friendshipReverse.id,
                                            "REJECTED"
                                        )}
                                    >
                                        <span className={styles.text}>
                                            Reject
                                        </span>
                                        <span className="material-symbols-rounded">
                                            group_remove
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => handleFriendshipResponse(
                                            friendshipReverse.id,
                                            "ACCEPTED"
                                        )}
                                    >
                                        <span className={styles.text}>
                                            Accept
                                        </span>
                                        <span className="material-symbols-rounded">
                                            how_to_reg
                                        </span>
                                    </button>
                                </div>
                            </div>)
                        }

                        // If the rendered user is not a friend to the logged user, let the logged user send a friendship request.
                        return !friendship
                            ? (
                                <button
                                    onClick={() => sendFriendshipRequest(
                                        user.id,
                                    )}
                                >
                                    <span
                                        className={styles.text}
                                    >
                                        Send friendship request
                                    </span>
                                    <span className="material-symbols-rounded">
                                        person_add
                                    </span>
                                </button>

                            )
                            : friendship.status === "ACCEPTED"
                                ? (
                                    <span
                                        className={styles.text}
                                    >
                                        Already friends
                                    </span>
                                )
                                : (
                                    <>
                                        <span className={styles.text}>
                                            Waiting for response
                                        </span>
                                        <button
                                            onClick={() => removeFriendship(
                                                friendship.id
                                            )}
                                        >
                                            <span className={styles.text}>
                                                Cancel friendship request
                                            </span>
                                            <span className="material-symbols-rounded">
                                                person_cancel
                                            </span>
                                        </button>
                                    </>
                                )
                    })()}
                    <button
                        onClick={() => {
                            setCurrentTargetUser(user);
                            setShowMessageModal(true);
                        }}
                        className={styles["send-message"]}
                    >
                        <span
                            className={styles.text}
                        >
                            Send message
                        </span>
                        <span className="material-symbols-rounded">
                            chat_add_on
                        </span>
                    </button>
                </div>
            )}
    </li>
};

export default SingleUser;
