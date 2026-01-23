import styles from "./Loader.module.css";
import { BounceLoader } from "react-spinners";

const Loader = () => {
    return <div className={styles.loader}>
        <BounceLoader
            color="var(--color-secondary)"
        />
        <p className={styles.message}>
            Loading messages...
        </p>
    </div>
};

export default Loader;
