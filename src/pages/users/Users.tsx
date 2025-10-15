import { NavLink, useLoaderData } from "react-router";
import { useState, type FormEvent } from "react";
import styles from "./Users.module.css"
import { useRouteLoaderData, useFetcher } from "react-router";
import type User from "../../types/user";
import { start } from "repl";

const Users = () => {
    const fetcher = useFetcher();
    const loaderData = useLoaderData();
    const rootData = useRouteLoaderData("root");
    const loggedUser = rootData.user;
    const users: User[] = loaderData?.users;
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [currentTargetUser, setCurrentTargetUser] = useState<User | null>(null);
    const [message, setMessage] = useState("");

    const handleMessageButtonClick = (user: User) => {
        setMessage("");
        setShowMessageModal(true);
        setCurrentTargetUser(user);
    };

    const closeMessageModal = () => {
        setShowMessageModal(false);
        setCurrentTargetUser(null);
        setMessage("");
    };

    const startConversation = (e: FormEvent) => {
        e.preventDefault();
        fetcher.submit(
            {
                message,
                recipientId: currentTargetUser!.id
            },
            {
                method: "POST",
            }
        );
    };

    return <main className={styles.users}>
        {users.length === 0 ? (
            <p>No users.</p>
        ) : (
            <ul className={styles.container}>
                {users.map((user: User) => {
                    return user.id === loggedUser?.id && users.length === 1
                        ? <p>You are the only user on the app :(</p>
                        : user.id === loggedUser?.id ? null
                            : <li
                                key={user.username}
                                className={styles.user}
                            >
                                <NavLink
                                    to={"/users/" + user.id}
                                >
                                    {user.username}
                                </NavLink>
                                <button
                                    onClick={() => handleMessageButtonClick(user)}
                                    className={styles["send-message"]}
                                >
                                    <span className={styles.text}>
                                        Send message
                                    </span>
                                    <span className="material-symbols-rounded">
                                        chat
                                    </span>
                                </button>
                            </li>
                })}
            </ul>
        )}
        {showMessageModal && currentTargetUser ? (
            <div
                style={{
                    border: "2px solid lime",
                }}
                className={styles["message-box"]}
            >
                <button
                    onClick={closeMessageModal}
                >
                    <span className="material-symbols-rounded">
                        close
                    </span>
                </button>
                <div className="user-profile">
                    <img
                        src={currentTargetUser.profilePictureUrl}
                        alt={`${currentTargetUser.firstName} ${currentTargetUser.lastName}'s profile picture.`}
                    />
                    <h3>
                        {currentTargetUser.firstName} {currentTargetUser.lastName}
                    </h3>
                    <p>
                        @{currentTargetUser.username}
                    </p>
                </div>
                <form
                    onSubmit={(e) => startConversation(e)}
                >
                    <label htmlFor="message">
                        Message
                        <input
                            id="message"
                            name="message"
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">
                        Send message
                    </button>
                </form>
            </div>
        ) : null}
    </main>
}

export default Users;
