import styles from "./NoResults.module.css";

const NoResults = ({ children }: React.PropsWithChildren<any>) => {
    return <main
        className={styles["no-results"]}
    >
        <div className={styles["children-wrapper"]}>
            {children}
        </div>
        <span className={`material-symbols-rounded ${styles.icon}`}>
            chat_error
        </span>
        <h1
            className={styles.title}
        >
            No Conversation
        </h1>
        <p
            className={styles.para}
        >
            We can't get the conversation you are trying to reach.
        </p>
    </main>
};

export default NoResults;
