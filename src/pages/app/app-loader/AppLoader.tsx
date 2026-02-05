import styles from "./AppLoader.module.css";
import { BarLoader } from "react-spinners";
import logo from "../../../assets/images/icon.svg";

const AppLoader = () => {
    return <div className={styles["app-loader"]}>
        <div className={styles.empty}></div>
        <div className={styles["logo-title"]}>
            <div className={styles["logo-container"]}>
                <img
                    className={styles.logo}
                    src={logo}
                    alt="Website logo"
                />
            </div>
            <h1
                className={styles.chatea}
            >
                Chateá!
            </h1>
        </div>
        <div className={styles["message-container"]}>
            <p className={styles.message}>
                Loading...
            </p>
            <BarLoader
                width="50px"
                color="var(--color-secondary)"
            />
        </div>
    </div>
}

export default AppLoader;
