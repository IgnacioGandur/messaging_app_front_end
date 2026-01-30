import styles from "./PageLoader.module.css";
import { SyncLoader } from "react-spinners";

interface PageLoader {
    message: string;
};

const PageLoader = ({
    message,
}: PageLoader) => {
    return <div
        className={styles["users-loader"]}
    >
        <SyncLoader
            size=".5rem"
            color="var(--light-dark-font)"
            className={styles.loader}
        />
        <p
            className={styles.text}
        >
            {message}
        </p>
    </div>
}

export default PageLoader;

