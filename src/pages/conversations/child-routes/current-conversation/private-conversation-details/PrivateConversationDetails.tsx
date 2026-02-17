import { NavLink } from "react-router";
import type User from "../../../../../types/user";
import styles from "./PrivateConversationDetails.module.css";
import DeleteConversation from "./delete-conversation/DeleteConversation";

interface PrivateConversationDetails {
    userB: User;
};

const PrivateConversationDetails = ({
    userB
}: PrivateConversationDetails) => {

    return <header
        id="user-b-info"
        className={styles["user-b-info"]}
    >
        <NavLink
            to={userB.id === 0 ? "/conversations" : `/users/${userB?.id}`}
            className={styles.user}
        >
            <img
                className={styles["profile-picture"]}
                src={userB?.profilePictureUrl}
                alt={`${userB?.firstName} ${userB?.lastName}'s profile picture.`}
            />
            <h2
                className={styles.name}
            >
                {userB?.firstName} {userB?.lastName}
            </h2>
            <p className={styles.username}>
                @{userB?.username}
            </p>
        </NavLink>
        <DeleteConversation />
    </header>
};

export default PrivateConversationDetails;
