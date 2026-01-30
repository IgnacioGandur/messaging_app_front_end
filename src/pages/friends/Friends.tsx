import styles from "./Friends.module.css";

// Types
import type Friendship from "../../types/friendship";
import type User from "../../types/user";

// Packages
import { useState } from "react";
import { format } from "date-fns";
import { Fragment } from "react";
import {
    NavLink,
    useNavigation,
    useRouteLoaderData,
    useSearchParams,
    useFetcher,
    useLoaderData
} from "react-router";

// Components
import PageLinks from "../../components/page-links/PageLinks";
import SearchForm from "../../components/search-form/SearchForm";
import PageLoader from "../../components/page-loader/PageLoader";
import MessageDialog from "../../components/message-dialog/MessageDialog";
import SubmitionLoader from "../../components/submition-loader/SubmitionLoader";

const Friends = () => {
    const fetcher = useFetcher();
    const navigation = useNavigation();
    const rootData = useRouteLoaderData("root");
    const loggedUser = rootData?.user;
    const loaderData = useLoaderData() as {
        success: boolean;
        message: string;
        data: {
            friends: Friendship[];
            meta: {
                currentPage: number;
                friendsCount: number;
                totalPages: number;
            }
        }
    };
    const friends: Friendship[] = loaderData?.data.friends || [];
    const friendsMetadata = loaderData?.data.meta;

    const isLoading = navigation.state === "loading";
    const isSubmitting = fetcher.state === "submitting";

    const [searchParams] = useSearchParams();

    const currentSearch = searchParams.get("search") || "";

    const deleteFriendship = (
        friendshipId: number | string
    ) => {
        fetcher.submit(
            {
                intent: "remove-friend",
                friendshipId
            },
            {
                method: "POST"
            }
        );
    };

    // Handle sending message to user.
    const [currentTargetUser, setCurrentTargetUser] = useState<User | null>(null);
    const [showMessageModal, setShowMessageModal] = useState(false);

    return <main className={styles.friends}>
        {isSubmitting && <SubmitionLoader message="Removing friend, please wait..." />}
        <MessageDialog
            currentTargetUser={currentTargetUser}
            setCurrentTargetUser={setCurrentTargetUser}
            showMessageModal={showMessageModal}
            setShowMessageModal={setShowMessageModal}
        />
        <header className={styles.header}>
            <h1
                className={styles.title}
            >
                <span className={`material-symbols-rounded ${styles.icon}`}>
                    handshake
                </span>
                <span className={styles.text}>
                    Friends
                </span>
            </h1>
            <SearchForm
                currentSearch={currentSearch}
                labelText="Search friend by username"
                usersAmout={`(${friendsMetadata.friendsCount} users)`}
            />
        </header>
        {currentSearch && (
            <div
                className={styles.filtering}
            >
                <h3>
                    Filtering friends by username: "{currentSearch}".
                </h3>
                <NavLink
                    to="/friends"
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
        {isLoading ? <PageLoader message="Getting friends..." /> : friends.length === 0 ? (
            <div className={styles["no-friends"]}>
                <span className={`material-symbols-rounded ${styles.icon}`}>
                    {currentSearch ? "search_off" : "sentiment_frustrated"}
                </span>
                <div className={styles.text}>
                    <h2
                        className={styles.title}
                    >
                        {currentSearch ? `We couldn't find any friends with a username containing: "${currentSearch}".` : "Seems like you don't have any friends"}

                    </h2>
                    {!currentSearch && (
                        <p
                            className={styles.paragraph}
                        >
                            You can look for friends
                            {" "}
                            <NavLink
                                to="/users"
                                className={styles.link}
                            >
                                here
                            </NavLink>
                        </p>
                    )}
                </div>
            </div>
        ) : (
            <ul className={styles.container}>
                {friends.map((f) => {
                    const user = f.userAId === loggedUser.id ? f.userB : f.userA;

                    return <Fragment
                        key={f.id}
                    >
                        <li
                            className={styles.friend}
                        >
                            <h2 className={styles.name}>
                                {user.firstName} {user.lastName}
                            </h2>
                            <p className={styles["friends-since"]}>
                                Friends since {format(f.createdAt, "MMMM do, yyyy")}
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
                                        deleteFriendship(f.id);
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
                                    onClick={() => {
                                        setCurrentTargetUser(user);
                                        setShowMessageModal(true);
                                    }}
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
                        <div className={styles.separator}></div>
                    </Fragment>
                })}
            </ul>
        )}
        <PageLinks
            currentSearch={currentSearch}
            currentPage={friendsMetadata.currentPage}
            searchParams={searchParams}
            totalPages={friendsMetadata.totalPages}
        />
    </main>
}

export default Friends; 
