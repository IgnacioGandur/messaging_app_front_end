import { NavLink } from "react-router";
import styles from "./AboutNavbar.module.css";

const AboutNavbar = () => {
    const links = [
        {
            path: "/about",
            icon: "info",
            text: "Info",
        },
        {
            path: "tools",
            icon: "build_circle",
            text: "Tools",
        },
        {
            path: "author",
            icon: "copyright",
            text: "Author",
        },
    ];

    return <nav className={styles.nav}>
        {links.map((l) => {
            return <NavLink
                end={l.path === "/about"}
                key={l.path}
                to={l.path}
                className={({ isActive }) => isActive ? `${styles.active}  ${styles.link}` : styles.link}
                data-text={l.text}
            >
                <span className={`material-symbols-rounded ${styles.icon}`}>
                    {l.icon}
                </span>
                <span className={styles.text}>
                    {l.text}
                </span>
            </NavLink>
        })}
    </nav>
};

export default AboutNavbar;
