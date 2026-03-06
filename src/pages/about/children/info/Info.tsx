import styles from "./Info.module.css";
import argentina from "../../../../assets/images/argentina.svg";

const Info = () => {
    return <section className={styles.info}>
        <header className={styles.header}>
            <h1 className={styles.title}>
                Chateá!
            </h1>
        </header>
        <p className={styles.paragraph}>
            I built this app to make staying in touch actually feel simple. Whether you’re catching up in a private chat, hanging out in groups, or just need to send over a quick file, everything happens in real-time. Add your friends, get instant notifications, and keep the conversation going without the clutter.
        </p>
        <section className={styles.author}>
            <h2 className={styles.title}>Ignacio Gandur</h2>
            <div className={styles["image-container"]}>
                <img
                    className={styles.argentina}
                    src={argentina}
                    alt="Argentina"
                />
            </div>
        </section>
    </section>
};

export default Info;
