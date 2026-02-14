import styles from "./ErrorPage.module.css";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";

const ErrorPage = () => {
    return <main className={styles["error-page"]}>
        <Navbar />
        <section className={styles.content}>
            <h1>error page</h1>
        </section>
        <Footer />
    </main>
}

export default ErrorPage;
