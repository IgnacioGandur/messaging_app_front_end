import { useRouteLoaderData, NavLink } from "react-router";
import styles from "./Navbar.module.css";
import { BarLoader } from "react-spinners";

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

    return <nav className={styles.navbar}>
        {links.map((link: Link) => {
            return <NavLink
                prefetch="intent"
                key={link.path}
                to={link.path}
                className={({ isActive }) => isActive ? styles.active : styles.link}
                viewTransition
            >
                {({ isPending }) => isPending ? <BarLoader color="#fff" /> : (
                    <>
                        <span className="material-symbols-rounded">
                            {link.icon}
                        </span>
                        <span className={styles.text}>
                            {link.text}
                        </span>
                    </>
                )}
            </NavLink>
        })}
    </nav>
}

export default Navbar;
