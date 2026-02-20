import styles from "./TooltipLoader.module.css";

const TooltipLoader = ({
    message
}: { message: string }) => {
    return <div className={styles.loader}>
        <p className={styles.message}>
            {message}
        </p>
        <span className={`material-symbols-rounded ${styles.icon}`}>
            progress_activity
        </span>
    </div>
};

export default TooltipLoader;
