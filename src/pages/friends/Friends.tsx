import styles from "./Friends.module.css";

// Types
import type Friendship from "../../types/friendship";
import type User from "../../types/user";

// Packages
import { useState } from "react";
import { format } from "date-fns";
import { Fragment } from "react";
import {
    useNavigation,
    useRouteLoaderData,
    useSearchParams,
    useFetcher,
    useLoaderData,
    NavLink
} from "react-router";

// Components
import PageLinks from "../../components/page-links/PageLinks";
import SearchForm from "../../components/search-form/SearchForm";
import PageLoader from "../../components/page-loader/PageLoader";
import MessageDialog from "../../components/message-dialog/MessageDialog";
import SubmitionLoader from "../../components/submition-loader/SubmitionLoader";
import Filtering from "../../components/filtering/Filtering";
import EmptyResults from "../../components/empty-results/EmptyResults";
import CurrentPageHeader from "../../components/current-page-header/CurrentPageHeader";
import SingleFriend from "./single-friend/SingleFriend";

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
    const isRemovingFriend = fetcher.state === "submitting" && fetcher.formData?.get("intent") === "remove-friend";

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
        {isSubmitting && (<SubmitionLoader
            message={`${isRemovingFriend
                ? "Removing friend"
                : null}, please wait...`}
        />)}
        <MessageDialog
            currentTargetUser={currentTargetUser}
            setCurrentTargetUser={setCurrentTargetUser}
            showMessageModal={showMessageModal}
            setShowMessageModal={setShowMessageModal}
        />
        <CurrentPageHeader
            icon="handshake"
            text="Friends"
        >
            <SearchForm
                currentSearch={currentSearch}
                labelText="Search friend by username"
                usersAmout={`(${friendsMetadata.friendsCount} users)`}
                placeholder="John"
            />
        </CurrentPageHeader>
        {currentSearch && (
            <Filtering
                filteringText="Filtering friends by username:"
                currentSearch={currentSearch}
                searchParams={searchParams}
                to="/friends"
            />
        )}
        {isLoading
            ? <PageLoader message="Getting friends..." />
            : friends.length === 0
                ? (
                    <EmptyResults
                        to="/users"
                        currentSearch={currentSearch}
                        emptyDataIcon="sentiment_frustrated"
                        emptyDataMessage="Seems like you don't have any friends yet."
                        emptySearchResultMessage="You don't have any friends that contain the username: "
                        redirectText="You can look for new friends "
                        showRedirect={true}
                    />
                ) : (
                    <ul className={styles.container}>
                        {friends.map((f) => {
                            const user = f.userAId === loggedUser.id ? f.userB : f.userA;

                            return <SingleFriend
                                user={user}
                                friendship={f}
                                deleteFriendship={deleteFriendship}
                                onClick={() => {
                                    setCurrentTargetUser(user);
                                    setShowMessageModal(true);
                                }}
                            />
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
