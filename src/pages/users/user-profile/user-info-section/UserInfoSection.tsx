import styles from "./UserInfoSection.module.css";
import { format } from "date-fns";
import type User from "../../../../types/user";
import { Form, useFetcher, useNavigation } from "react-router";
import CustomInput from "../../../../components/custom-input/CustomInput";
import { useState } from "react";
import type Friendship from "../../../../types/friendship";

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
    const navigation = useNavigation();
    // If true means the logged user has a pending friendship request from this user.
    const hasReceivedFriendshipRequest = friendship
        && friendship.status === "PENDING"
        && friendship.userAId === user.id;
    const isSendingMessage = navigation.state === "submitting";
    const isHandlingRequest = fetcher.state === "submitting"
        && fetcher
            .formData?.get("intent")?.toString().includes("friend");

    const [message, setMessage] = useState("");

    const handleMessage = (_: string, value: string) => {
        setMessage(value);
    };

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
                You
            </span>
            : <>
                <div className={styles["message-button"]}>
                    <button
                        className={styles.button}
                        popoverTarget="message-form-wrapper"
                        aria-describedby="message-tooltip"
                    >
                        <span className={`material-symbols-rounded ${styles.icon}`}>
                            comic_bubble
                        </span>
                    </button>
                    <p
                        id="message-tooltip"
                        role="tooltip"
                        className={styles.tooltip}
                    >
                        Send Message
                    </p>
                    <div
                        className={styles["message-form-wrapper"]}
                        popover="auto"
                        id="message-form-wrapper"
                    >
                        <Form
                            method="post"
                            className={styles["message-form"]}
                        >
                            <input
                                type="hidden"
                                name="intent"
                                value="send-message"
                            />
                            <CustomInput
                                name="message"
                                id="message"
                                type="text"
                                labelText="Send your message!"
                                googleIcon="send"
                                value={message}
                                onChange={handleMessage}
                                placeholder="Hello! Nice to meet you!"
                                minLength={1}
                                maxLength={125}
                                required={true}
                            />
                            <button
                                className={styles.button}
                            >
                                Send message
                            </button>
                        </Form>
                    </div>
                </div>
                {isHandlingRequest ? (
                    <div className={styles["friendship-button"]}>
                        <button
                            className={`${styles.button} ${styles.loader}`}
                        >
                            <span className="material-symbols-rounded">
                                progress_activity
                            </span>
                        </button>
                    </div>
                ) : (
                    hasReceivedFriendshipRequest ? (
                        <div className={styles["friendship-button"]}>
                            <button
                                className={`
                                    ${styles.button}
                                    ${styles["friendship-request"]}
                                `}
                                popoverTarget="handle-friendship-request"
                            >
                                <span className={`material-symbols-rounded ${styles.icon}`}>
                                    handshake
                                </span>
                            </button>
                            <p className={styles.tooltip}>
                                Wants to be your friend
                            </p>
                            <div
                                popover="auto"
                                id="handle-friendship-request"
                                className={styles["friendship-request-tooltip"]}
                            >
                                <div className={styles["content-wrapper"]}>
                                    <h4
                                        className={styles.title}
                                    >
                                        <span className={styles.name}>
                                            {name}
                                        </span> wants to be your friend!
                                    </h4>
                                    <div className={styles.option}>
                                        <button
                                            onClick={acceptFriendshipRequest}
                                            className={styles.button}
                                        >
                                            <span className="material-symbols-rounded">
                                                check
                                            </span>
                                        </button>
                                        <p>Accept</p>
                                    </div>
                                    <div className={styles.option}>
                                        <button
                                            onClick={cancelFriendship}
                                            className={styles.button}
                                        >
                                            <span className="material-symbols-rounded">
                                                close
                                            </span>
                                        </button>
                                        <p>Reject</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : friendship
                        ? <div
                            className={styles["friendship-button"]}
                        >
                            <button
                                onClick={cancelFriendship}
                                className={styles.button}
                                aria-describedby="remove-friendship-tooltip"
                            >
                                <span className={`material-symbols-rounded ${styles.icon}`}>
                                    {friendship.status === "PENDING" ? "person_cancel" : "person_remove"}
                                </span>
                            </button>
                            <p
                                id="remove-friendship-tooltip"
                                role="tooltip"
                                className={styles.tooltip}
                            >
                                {friendship.status === "PENDING" ? "Cancel friendship request" : "Remove from friends"}
                            </p>
                        </div>
                        : <div
                            className={styles["friendship-button"]}
                        >
                            <button
                                onClick={sendFriendshipRequest}
                                className={styles.button}
                                aria-labelledby="send-friendship-request-tooltip"
                            >
                                <span className={`material-symbols-rounded ${styles.icon}`}>
                                    person_add
                                </span>
                            </button>
                            <p
                                id="send-friendship-request-tooltip"
                                role="tooltip"
                                className={styles.tooltip}
                            >
                                Send friend request
                            </p>
                        </div>
                )}
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
