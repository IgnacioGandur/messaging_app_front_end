import { Outlet } from "react-router";
import styles from "./About.module.css";
import AboutNavbar from "./about-navbar/AboutNavbar";

const About = () => {
    return <main className={styles.about}>
        <AboutNavbar />
        <Outlet />
    </main>
};

export default About;
