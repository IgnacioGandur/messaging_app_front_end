import styles from "./About.module.css";

const About = () => {
    return (
        <main className={styles.about}>
            <header className={styles.header}>
                <div className={styles["styled-padding"]}></div>
                <h1 className={styles.title}>About this website</h1>
            </header>
            <section className={styles.section}>
                <h2 className={styles.title}>The purpose of this website</h2>
                <p className={styles.text}>
                    Chateá! is a personal project to learn about the
                    implementation of real-time features alongside database
                    storage in web applications using Socket.io amongst the
                    other necessary tools.
                </p>
            </section>
            <section className={styles.section}>
                <h2 className={styles.title}>Author</h2>
                <p className={styles.text}>Ignacio Gandur 🇦🇷</p>
            </section>
        </main>
    );
};

export default About;
