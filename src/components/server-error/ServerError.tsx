import styles from "./ServerError.module.css";

type ServerErrorProps = {
    title: string;
    message: string;
};

const ServerError = ({
    title,
    message
}: ServerErrorProps) => {
    return <section className={styles["server-error"]}>
        <h3 className={styles["title"]}>{title}</h3>
        <p className={styles["message"]}>{message}</p>
    </section>
}

export default ServerError;
