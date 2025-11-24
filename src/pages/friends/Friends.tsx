import styles from "./Friends.module.css";
import { useLoaderData } from "react-router";

const Friends = () => {
    const loaderData = useLoaderData();
    console.log("The content of loaderData is:", loaderData);

    return <main className={styles.friends}>
        friends section
    </main>
}

export default Friends;
