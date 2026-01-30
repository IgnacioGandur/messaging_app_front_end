import styles from "./Users.module.css"

// Packages
import {
    NavLink,
    useLoaderData,
    useNavigation,
    useSearchParams,
} from "react-router";
import { Fragment, useEffect, useRef, useState } from "react";
import { useRouteLoaderData, useFetcher } from "react-router";

// Components
import PageLinks from "../../components/page-links/PageLinks";
import SubmitionLoader from "../../components/submition-loader/SubmitionLoader";
import PageLoader from "../../components/page-loader/PageLoader";
import MessageDialog from "../../components/message-dialog/MessageDialog";

// Types
import type User from "../../types/user";
import type Friendship from "../../types/friendship";
import SearchForm from "../../components/search-form/SearchForm";

const Users = () => {
    const fetcher = useFetcher();
    const navigation = useNavigation();
    const [searchParams] = useSearchParams();

    // Data
    const loaderData = useLoaderData();
    const rootData = useRouteLoaderData("root");
    const loggedUser = rootData.user;
    const users: User[] = loaderData?.users;
    const usersMetadata = loaderData?.meta as {
        currentPage: number;
        totalCount: number;
        totalPages: number;
    };
    const friendships: Friendship[] = loaderData?.friendships;
    const currentSearch = searchParams.get("search") || "";

    // Handle send message to user.
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [currentTargetUser, setCurrentTargetUser] = useState<User | null>(null);
    const messageDialogRef = useRef<HTMLDialogElement | null>(null);

    const isPageLoading = navigation.state === "loading";

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
        {fetcher.state !== "idle" && <SubmitionLoader message="Please wait..." />}
        <MessageDialog
            showMessageModal={showMessageModal}
            setShowMessageModal={setShowMessageModal}
            currentTargetUser={currentTargetUser}
            setCurrentTargetUser={setCurrentTargetUser}
        />
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
            <SearchForm
                currentSearch={currentSearch}
                labelText="Search users by their usernames."
                usersAmout={`(${usersMetadata.totalCount} users)`}
            />
        </header>
        {searchParams.get("search") && (
            <div
                className={styles.filtering}
            >
                <h3>
                    Filtering users by username: "{currentSearch}".
                </h3>
                <NavLink
                    to="/users"
                    replace={true}
                    onClick={() => searchParams.set("search", "")}
                    className={styles["clear-search"]}
                >
                    <span
                        className="material-symbols-rounded"
                    >
                        close
                    </span>
                    <span>
                        Clear search
                    </span>
                </NavLink>
            </div>
        )}
        {users.length === 0
            ? (
                <div
                    className={styles["no-users"]}
                >
                    <span
                        className={`material-symbols-rounded ${styles.icon}`}
                    >
                        {currentSearch ? "search_off" : "no_accounts"}
                    </span>
                    <p
                        className={styles.text}
                    >
                        {currentSearch ? `No users matched the username containing: "${currentSearch}"` : "There are no registered users yet."}
                    </p>
                </div>
            )
            : (
                isPageLoading ? <PageLoader message="Getting users..." /> : <ul className={styles.container}>
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
                                {user.id === loggedUser.id ? <p
                                    className={styles.you}
                                >
                                    (You)
                                </p> : (
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
                            <div
                                className={styles.separator}
                            >
                            </div>
                        </Fragment>
                    })}
                </ul>
            )}
        <PageLinks
            currentPage={usersMetadata.currentPage}
            currentSearch={currentSearch}
            searchParams={searchParams}
            totalPages={usersMetadata.totalPages}
        />
    </main>
}

export default Users;
