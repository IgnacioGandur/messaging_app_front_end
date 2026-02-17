import styles from "./DeleteConversation.module.css";

interface DeleteConversationProps {
};

const DeleteConversation = ({
}: DeleteConversationProps) => {
    return <div className={styles["delete-conversation"]}>
        <button
            title="Delete conversation?"
            className={styles.button}
            popoverTarget="delete-conversation"
        >
            <span className="material-symbols-rounded">
                delete
            </span>
        </button>
        <div
            id="delete-conversation"
            className={styles.tooltip}
            popover="auto"
        >
            <div className={styles.wrapper}>
                <p className={styles.text}>
                    Are you sure you want to delete this conversation?
                </p>
                <button className={styles.button}>
                    Yes
                </button>
            </div>
        </div>
    </div>
}

export default DeleteConversation;
