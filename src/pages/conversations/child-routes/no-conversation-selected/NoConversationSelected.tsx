import styles from "./NoConversationSelected.module.css";
import { NavLink } from "react-router";

const NoConversationSelected = () => {
    return <section className={styles["no-conversation-selected"]}>
        <p>
            No conversation selected.
        </p>
        <p>
            You can look for somebody to chat with <br />
            <NavLink to="/users">here</NavLink>
        </p>
    </section>
}

export default NoConversationSelected;
