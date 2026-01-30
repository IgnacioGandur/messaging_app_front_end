import styles from "./SubmitionLoader.module.css";
import { PuffLoader } from "react-spinners";

interface SubmitionLoaderProps {
    message: string;
};

const SubmitionLoader = ({
    message,
}: SubmitionLoaderProps) => {
    return <div className={styles["loader-container"]}>
        <PuffLoader
            color="var(--color-secondary)"
        />
        <p className={styles.message}>
            {message}
        </p>
    </div>
};

export default SubmitionLoader;
