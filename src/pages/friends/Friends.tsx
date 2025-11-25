import { useRouteLoaderData } from "react-router";
import type Friendship from "../../types/friendship";
import styles from "./Friends.module.css";
import { useLoaderData } from "react-router";
import { useFetcher } from "react-router";

const Friends = () => {
    const fetcher = useFetcher();
    const rootData = useRouteLoaderData("root");
    const loggedUser = rootData?.user;
    const loaderData = useLoaderData();
    const friendships: Friendship[] = loaderData?.friendships;

    const deleteFriendship = (
        friendshipId: number | string
    ) => {
        fetcher.submit(
            {
                friendshipId
            },
            {
                method: "POST"
            }
        );
    };

    return <main className={styles.friends}>
        {friendships.length > 0
            ? (
                friendships.map((f) => {
                    const friend = f.userAId === loggedUser.id ? f.userB : f.userA;
                    return <div
                        key={friend.id}
                        className={styles.friend}
                    >
                        <p>Friends since: {String(f.createdAt)}</p>
                        <img
                            src={friend.profilePictureUrl}
                            alt={`${friend.firstName} ${friend.lastName}'s profile picture`}
                        />
                        <h2>
                            {friend.firstName} {friend.lastName}
                        </h2>
                        <p>
                            {friend.username}
                        </p>
                        <div className={styles.buttons}>
                            <button
                                onClick={() => deleteFriendship(f.id)}
                            >
                                Remove
                                <span className="material-symbols-rounded">
                                    cancel
                                </span>
                            </button>
                        </div>
                    </div>
                })
            )
            : (
                <p>You don't have any friends.</p>
            )}
    </main>
}

export default Friends; 
