import styles from "./Home.module.css";

// Assets
import logo from "../../assets/images/icon.svg";

// Packages
import { useRouteLoaderData } from "react-router";

// Components
import Blob from "../../components/blob/Blob";
import Dashboard from "../dashboard/Dashboard";

// Types
import type RootLoaderDataProps from "../../types/rootLoaderData";


const Home = () => {
    const loaderData = useRouteLoaderData("root") as RootLoaderDataProps;
    const user = loaderData?.user;

    if (user) {
        return <Dashboard />
    }

    return <main className={styles["home-logged"]}>
        <div className={styles["title-section"]}>
            <h1
                className={styles.title}
            >
                Chat your way, every day. Chateá!
            </h1>
        </div>
        <section className={styles["blob-section"]}>
            <div className={styles.background}></div>
            <div className={styles["blob-wrapper"]}>
                <Blob
                    onlyGlow={false}
                />
            </div>
            <div className={styles["logo-wrapper"]}>
                <img
                    className={styles.logo}
                    src={logo}
                    alt="Website logo."
                />
            </div>
        </section>
        <div className="bottom-text">
            <h2
                className={styles["sub-title-section"]}
            >
                Stay close to your friends, send images, and keep the conversation going. Fast, fun and easy to use.
            </h2>
        </div>
    </main>
};

export default Home;
