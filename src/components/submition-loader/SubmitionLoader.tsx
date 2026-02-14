import styles from "./SubmitionLoader.module.css";
import { PuffLoader } from "react-spinners";

interface SubmitionLoaderProps {
    message: string;
};

const SubmitionLoader = ({
    message,
}: SubmitionLoaderProps) => {
    return <div className={styles["loader-container"]}>
        <div className={styles.backdrop}>
        </div>
        <div className={styles.loader}>
            <PuffLoader
                color="var(--color-secondary)"
            />
            <p className={styles.message}>
                {message}
            </p>
        </div>
    </div>
};

export default SubmitionLoader;
