import { useRouteLoaderData, NavLink } from "react-router";
import styles from "./Navbar.module.css";

type Link = {
    path: string;
    text: string;
    icon: string;
};

const Navbar = () => {
    const loaderData = useRouteLoaderData("root");

    const commonLinks = [
        {
            path: "/",
            text: "Home",
            icon: "home"
        },
        {
            path: "/about",
            text: "About",
            icon: "info"
        },
    ]

    const links = commonLinks.concat(
        loaderData?.success ?
            [
                {
                    path: "/chats",
                    text: "Chats",
                    icon: "chat"
                },
                {
                    path: "/logout",
                    text: "Logout",
                    icon: "logout"
                },
            ] : [
                {
                    path: "/register",
                    text: "Register",
                    icon: "checkbook"
                },
                {
                    path: "/login",
                    text: "Login",
                    icon: "login"
                },
            ]
    );

    return <nav className={styles["navbar"]}>
        {links.map((link: Link) => {
            return <NavLink
                to={link.path}
                className={styles["link"]}
            >
                <span className={`material-symbols-rounded ${styles["icon"]}`}>
                    {link.icon}
                </span>
                <span
                    className={styles["text"]}
                >
                    {link.text}
                </span>
            </NavLink>
        })}
    </nav>
}

export default Navbar;
