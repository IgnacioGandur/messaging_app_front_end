import styles from "./UserProfile.module.css";
import { useLoaderData } from "react-router";

const UserProfile = () => {
    const loaderData = useLoaderData();
    const user = loaderData?.user;
    return <main className={styles["user-profile"]}>
        user profile
        <h2 className={styles.name}>
            {user.firstName} {user.lastName}
        </h2>
        <p className={styles.username}>
            {user.username}
        </p>
    </main>
}

export default UserProfile;
