import { NavLink } from "react-router";
import styles from "./Sidebar.module.css";

type Link = {
    path: string;
    text: string;
    icon: string;
};

const Sidebar = () => {
    const links: Link[] = [
        {
            path: "settings",
            text: "Settings",
            icon: "settings"
        }
    ];
    return <aside className={styles.sidebar}>
        {links.map((link) => {
            return <NavLink
                key={link.text}
                to={link.path}
                className={styles.option}
            >
                <span className="material-symbols-rounded">
                    {link.icon}
                </span>
                <span className={styles.text}>
                    {link.text}
                </span>
            </NavLink>
        })}
    </aside>
}

export default Sidebar;
