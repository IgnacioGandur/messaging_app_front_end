import styles from "./UserInfoSection.module.css";
import { format } from "date-fns";
import type User from "../../../../types/user";
import { useFetcher } from "react-router";
import type Friendship from "../../../../types/friendship";
import SendMessageButton from "../../../../mini-components/send-message-button/SendMessageButton";
import FriendshipRequestButton from "../../../../mini-components/friendship-request-button/FriendshipRequestButton";

interface UserInfoSectionProps {
    isYou: boolean;
    friendship: Friendship | undefined;
    user: User;
    name: string;
    friendshipId?: number | undefined;
};

const UserInfoSection = ({
    isYou,
    friendship,
    user,
    name,
}: UserInfoSectionProps) => {
    const fetcher = useFetcher();

    // If true means the logged user has a pending friendship request from this user.
    const hasReceivedFriendshipRequest = friendship
        && friendship.status === "PENDING"
        && friendship.userAId === user.id;
    const isHandlingRequest = fetcher.state === "submitting"
        && fetcher
            .formData?.get("intent")?.toString().includes("friend");

    const sendFriendshipRequest = (
    ) => {
        fetcher.submit(
            {
                intent: "send-friendship-request",
                userBId: user.id,
            },
            {
                method: "post"
            }
        );
    };

    const cancelFriendship = () => {
        if (!friendship) return;

        fetcher.submit(
            {
                intent: "cancel-friendship",
                friendshipId: friendship.id,
            },
            {
                method: "delete"
            }
        )
    };

    const acceptFriendshipRequest = () => {
        if (!friendship) return;

        fetcher.submit(
            {
                friendshipId: friendship.id,
                intent: "accept-friendship-request",
                status: "ACCEPTED"
            },
            {
                method: "put"
            }
        );
    };

    return <section className={styles["user-info"]}>
        {isYou
            ? <span className={styles.you}>
                (You)
            </span>
            : <>
                <SendMessageButton
                    incluceMessageRecipientId={true}
                    messageRecipientId={user.id}
                    className={styles["message-button"]}
                    style={{
                        alignSelf: "end"
                    }}
                />
                <FriendshipRequestButton
                    isSubmitting={isHandlingRequest}
                    hasFriendshipRequestFromThisUser={hasReceivedFriendshipRequest}
                    name={name}
                    acceptFriendshipRequest={acceptFriendshipRequest}
                    cancelFriendship={cancelFriendship}
                    friendship={friendship}
                    sendFriendshipRequest={sendFriendshipRequest}
                    style={{
                        gridArea: "friendship-button",
                        alignSelf: "end"
                    }}
                />
            </>}
        <h2 className={styles.name}>
            {user.firstName} {user.lastName}
        </h2>
        <figure className={styles.wrapper}>
            <div className={styles.padding}>
                <img
                    className={styles.ppf}
                    src={user.profilePictureUrl}
                    alt={name}
                />
            </div>
        </figure>
        <p className={styles.date}>
            <time dateTime={new Date(user.joinedOn).toISOString()}>
                Joined on {format(user.joinedOn, "MMMM do, yyyy 'at' KK:mm bb")}
            </time>
        </p>
        <p className={styles.username}>
            @{user.username}
        </p>
    </section>

};

export default UserInfoSection;
