import styles from "./Users.module.css"

// Packages
import { NavLink, useLoaderData, useNavigation, useLocation } from "react-router";
import { Fragment, useEffect, useRef, useState } from "react";
import { useRouteLoaderData, useFetcher } from "react-router";
import { format } from "date-fns";
import { SyncLoader } from "react-spinners";

// Types
import type User from "../../types/user";
import type Friendship from "../../types/friendship";
import type { FormEvent } from "react";

const Users = () => {
    const fetcher = useFetcher();
    const navigation = useNavigation();
    const location = useLocation();
    const loaderData = useLoaderData();
    const rootData = useRouteLoaderData("root");
    const loggedUser = rootData.user;
    const users: User[] = loaderData?.users;
    console.log("The content of users is:", users);
    const usersMetadata = loaderData?.meta as {
        currentPage: number;
        totalCount: number;
        totalPages: number;
    };
    const friendships: Friendship[] = loaderData?.friendships;

    // Handle send message to user.
    const [message, setMessage] = useState("");
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [currentTargetUser, setCurrentTargetUser] = useState<User | null>(null);
    const messageDialogRef = useRef<HTMLDialogElement | null>(null);

    const isPageLoading = navigation.state === "loading";

    const toggleMessageDialog = () => {
        setShowMessageModal((prev) => !prev);
    };

    const closeMessageModal = () => {
        setMessage("");
        setCurrentTargetUser(null);
        setShowMessageModal(false);
    };

    const startConversation = (e: FormEvent) => {
        if (!currentTargetUser) return;

        e.preventDefault();
        fetcher.submit(
            {
                intent: "send-message",
                message,
                recipientId: currentTargetUser.id
            },
            {
                method: "POST",
            }
        );
    };

    const sendFriendshipRequest = (
        userBId: number
    ) => {
        fetcher.submit(
            {
                intent: "send-friendship-request",
                userBId,
            },
            {
                method: "POST"
            }
        );
    }

    const handleFriendshipResponse = (
        friendshipId: number,
        status: "PENDING" | "ACCEPTED" | "REJECTED"
    ) => {
        fetcher.submit(
            {
                intent: "handle-friendship-response",
                status,
                friendshipId
            },
            {
                method: "POST"
            }
        )
    };

    const removeFriendship = (
        friendshipId: number
    ) => {
        fetcher.submit(
            {
                intent: "remove-friend",
                friendshipId,
            },
            {
                method: "DELETE"
            }
        )
    };

    useEffect(() => {
        if (!messageDialogRef.current) return;

        if (showMessageModal) {
            messageDialogRef.current.showModal();
        } else {
            messageDialogRef.current.close();
        }
    }, [showMessageModal]);

    return <main className={styles.users}>
        {fetcher.state === "submitting" && <p>Submitting...</p>}
        <dialog
            ref={messageDialogRef}
            className={styles["message-dialog"]}
        >
            <div className={styles.wrapper}>
                <button
                    className={styles.close}
                    onClick={closeMessageModal}
                >
                    <span className="material-symbols-rounded">
                        close
                    </span>
                </button>
                <h2
                    className={styles.title}
                >
                    Start a conversation
                </h2>
                {currentTargetUser && (
                    <NavLink
                        to={`/users/${currentTargetUser.id}`}
                        className={styles["target-user"]}>
                        <p className={styles.name}>
                            {currentTargetUser?.firstName} {currentTargetUser?.lastName}
                        </p>
                        <p className={styles.username}>
                            @{currentTargetUser?.username}
                        </p>
                        <p className={styles.date}>
                            <span className="material-symbols-rounded">
                                calendar_month
                            </span>
                            <span className={styles.text}>
                                Joined on {format(currentTargetUser?.joinedOn, "MMMM do, yyyy")}
                            </span>
                        </p>
                        <img
                            className={styles.ppf}
                            src={currentTargetUser?.profilePictureUrl}
                            alt={`${currentTargetUser?.username}'s profile picture`}
                        />
                    </NavLink>
                )}
                <fetcher.Form
                    onSubmit={startConversation}
                    method="POST"
                    className={styles["message-form"]}
                >
                    <p
                        className={styles.title}
                    >
                        What do you want to say?
                    </p>
                    <input
                        className={styles.input}
                        value={message}
                        onChange={((e) => {
                            setMessage(e.target.value);
                        })}
                        type="text"
                        name="message"
                        id="message"
                    />
                    <button
                        className={styles.button}
                    >
                        <span
                            className="material-symbols-rounded"
                        >
                            arrow_upward
                        </span>
                    </button>
                </fetcher.Form>
            </div>
        </dialog>
        <header
            className={styles.header}
        >
            <h2
                className={styles.title}
            >
                <span className={`material-symbols-rounded ${styles.icon}`}>
                    group
                </span>
                <span className={styles.text}>
                    Users
                </span>
            </h2>
            <div className={styles["form-container"]}>
                <p className={styles["users-n"]}>
                    {usersMetadata.totalCount} Users
                </p>
                <fetcher.Form
                    className={styles["search-form"]}
                >
                    <div
                        className={styles["input-wrapper"]}
                    >
                        <span
                            className="material-symbols-rounded"
                        >
                            search
                        </span>
                        <div className={styles.separator}></div>
                        <input
                            type="text"
                            name="searchTerm"
                            placeholder="Username"
                        />
                    </div>
                    <button
                        className={styles["search-button"]}
                    >
                        Search
                    </button>
                </fetcher.Form>
            </div>
        </header>
        {users.length === 0
            ? (
                <div
                    className={styles["no-users"]}
                >
                    <span
                        className={`material-symbols-rounded ${styles.icon}`}
                    >
                        no_accounts
                    </span>
                    <p
                        className={styles.text}
                    >
                        There are no registered users yet.
                    </p>
                </div>
            )
            : (
                isPageLoading ? <div
                    className={styles["users-loader"]}
                >
                    <SyncLoader
                        size=".5rem"
                        color="var(--light-dark-font)"
                        className={styles.loader}
                    />
                    <p
                        className={styles.text}
                    >
                        Getting users...
                    </p>
                </div> : <ul className={styles.container}>
                    {users.map((user) => {
                        return <Fragment
                            key={user.username}
                        >
                            <li
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
                                <div
                                    className={styles.buttons}
                                >
                                    {(() => {
                                        {/* These are the received friendship requests. */ }
                                        const friendship = friendships.find((f) => f.userAId === loggedUser?.id && f.userBId === user.id);

                                        {/* These are the frienships requests sent by the logged user. */ }
                                        const friendshipReverse = friendships.find((f) => f.userBId === loggedUser?.id && f.userAId === user.id);

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
                                                    <p>
                                                        Friends
                                                    </p>
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
                                            setMessage("");
                                            setCurrentTargetUser(user);
                                            toggleMessageDialog();
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
                            </li>
                            <div
                                className={styles.separator}
                            >
                            </div>
                        </Fragment>
                    })}
                </ul>
            )}
        <nav className={styles.pages}>
            {usersMetadata.currentPage > 1 && (
                <NavLink
                    to={`?page=${usersMetadata.currentPage - 1}`}
                    className={styles.previous}
                >
                    <span className={styles.text}>
                        Previous page
                    </span>
                    <span className="material-symbols-rounded">
                        arrow_back
                    </span>
                </NavLink>
            )}
            {Array.from({ length: usersMetadata.totalPages }, (_, i) => {
                const pageNum = i + 1;
                const pagePath = `?page=${pageNum}`;

                const isActive = location.search === pagePath || (location.search === "" && pageNum === 1);

                return <NavLink
                    key={pageNum}
                    to={pagePath}
                    className={isActive ? `${styles.active} ${styles.link}` : styles.link}
                >
                    {pageNum}
                </NavLink>
            })}
            {usersMetadata.currentPage < usersMetadata.totalPages && (
                <NavLink
                    to={`?page=${usersMetadata.currentPage + 1}`}
                    className={styles.next}
                >
                    <span className={styles.text}>
                        Next page
                    </span>
                    <span className="material-symbols-rounded">
                        arrow_forward
                    </span>
                </NavLink>
            )}
        </nav>
    </main>
}

export default Users;
