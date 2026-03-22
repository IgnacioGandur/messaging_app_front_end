import styles from "./Home.module.css";

// Assets
import logo from "../../assets/images/icon.svg";
// Components
import Blob from "../../components/blob/Blob";

const Home = () => {
    return (
        <main className={styles.home}>
            <div className={styles["title-section"]}>
                <h1 className={styles.title}>
                    Chat your way, every day. Chateá!
                </h1>
            </div>
            <section className={styles["blob-section"]}>
                <div className={styles.background}></div>
                <div className={styles["blob-wrapper"]}>
                    <Blob onlyGlow={false} />
                </div>
                <div className={styles["logo-wrapper"]}>
                    <img
                        className={styles.logo}
                        src={logo}
                        alt="Website logo."
                    />
                </div>
            </section>
            <div className={styles["bottom-text"]}>
                <p className={styles["sub-title-section"]}>
                    Stay close to your friends, send images, and keep the
                    conversation going. Fast, fun and easy to use.
                </p>
            </div>
        </main>
    );
};

export default Home;
