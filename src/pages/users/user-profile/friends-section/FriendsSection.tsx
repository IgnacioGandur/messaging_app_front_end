import styles from "./FriendsSection.module.css";
import type User from "../../../../types/user";
import { NavLink } from "react-router";

interface FriendsSectionProps {
    friends: User[];
};

const FriendsSection = ({
    friends,
}: FriendsSectionProps) => {
    return <section
        className={styles.friends}
    >
        <header
            className={styles.header}
        >
            <span className={`material-symbols-rounded ${styles.icon}`}>
                diversity_3
            </span>
            <h3 className={styles.text}>
                Friends ({friends.length})
            </h3>
        </header>
        {friends.length === 0
            ? (
                <div className={styles["no-friends"]}>
                    <span className="material-symbols-rounded">
                        sentiment_frustrated
                    </span>
                    <p className={styles.text}>
                        This user doesn't have any friends yet.
                    </p>
                </div>
            ) : (
                <ul className={styles.container}>
                    {friends.map((f) => {
                        const name = f.firstName + " " + f.lastName;
                        return <NavLink
                            viewTransition
                            key={f.id}
                            title="Go to user profile."
                            to={`/users/${f.id}`}
                        >
                            <figure
                                className={styles.friend}
                            >
                                <img
                                    className={styles.ppf}
                                    src={f.profilePictureUrl}
                                />
                                <figcaption className={styles.tooltip}>
                                    {name}
                                </figcaption>
                            </figure>
                        </NavLink>
                    })}
                </ul>
            )}
    </section>
};

export default FriendsSection;
