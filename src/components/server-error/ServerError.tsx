import styles from "./ServerError.module.css";

type ServerErrorProps = {
    message: string;
};

const ServerError = ({
    message
}: ServerErrorProps) => {
    return <section className={styles["server-error"]}>
        <span className={`material-symbols-rounded ${styles.icon}`}>
            conversion_path_off
        </span>
        <p className={styles["message"]}>{message}</p>
    </section>
}

export default ServerError;
