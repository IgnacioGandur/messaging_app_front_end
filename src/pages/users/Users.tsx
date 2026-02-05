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
import Filtering from "../../components/filtering/Filtering";
import EmptyResults from "../../components/empty-results/EmptyResults";
import CurrentPageHeader from "../../components/current-page-header/CurrentPageHeader";
import SingleUser from "./single-user/SingleUser";

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

    const isSubmitting = fetcher.state === "submitting";
    const isPageLoading = navigation.state === "loading";
    const isSendingRequest = fetcher.state === "submitting" && fetcher.formData!.get("intent") === "send-friendship-request";
    const isRespondingToRequest = fetcher.state === "submitting" && fetcher.formData!.get("intent") === "handle-friendship-response";
    const isRemovingFriend = fetcher.state === "submitting" && fetcher.formData!.get("intent") === "remove-friend";

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
        {isSubmitting
            && (<SubmitionLoader
                message={`${isSendingRequest
                    ? "Sending request"
                    : isRespondingToRequest
                        ? "Responding to request"
                        : isRemovingFriend
                            ? "Removing friend"
                            : null}, please wait...`}
            />)}
        <MessageDialog
            showMessageModal={showMessageModal}
            setShowMessageModal={setShowMessageModal}
            currentTargetUser={currentTargetUser}
            setCurrentTargetUser={setCurrentTargetUser}
        />
        <CurrentPageHeader
            icon="group"
            text="Users"
        >
            <SearchForm
                currentSearch={currentSearch}
                labelText="Search users by their usernames."
                usersAmout={`(${usersMetadata.totalCount} users)`}
                placeholder="John"
            />
        </CurrentPageHeader>
        {searchParams.get("search") && (
            <Filtering
                filteringText="Filtering users by username:"
                currentSearch={currentSearch}
                searchParams={searchParams}
                to="/users"
            />
        )}
        {users.length === 0
            ? (
                <EmptyResults
                    currentSearch={currentSearch}
                    emptyDataIcon="no_accounts"
                    emptySearchResultMessage="We couldn't find any users with a username containing:"
                    emptyDataMessage="There are no users registered yet."
                    to="/users"
                    showRedirect={false}
                />
            )
            : (
                isPageLoading
                    ? <PageLoader message="Getting users..." />
                    : <ul className={styles.container}>
                        {users.map((user, i) => {
                            return <Fragment
                                key={user.id}
                            >
                                <SingleUser
                                    user={user}
                                    friendships={friendships}
                                    removeFriendship={removeFriendship}
                                    handleFriendshipResponse={handleFriendshipResponse}
                                    sendFriendshipRequest={sendFriendshipRequest}
                                    setCurrentTargetUser={setCurrentTargetUser}
                                    setShowMessageModal={setShowMessageModal}
                                />
                                {i !== 9 && (
                                    <div className={styles.separator}></div>
                                )}
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
