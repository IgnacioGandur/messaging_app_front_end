import { useRouteLoaderData, NavLink } from "react-router";
import styles from "./Navbar.module.css";
import { BarLoader } from "react-spinners";
import LoggedUser from "./LoggedUser";
import Notifications from "./Notifications";

type Link = {
    path: string;
    text: string;
    icon: string;
};

const Navbar = () => {
    const loaderData = useRouteLoaderData("root");
    const loggedUser = loaderData.user;

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
        {
            path: "/groups",
            text: "Groups",
            icon: "communities"
        },
    ]

    const links = commonLinks.concat(
        loaderData?.success ?
            [
                {
                    path: "/users",
                    text: "Users",
                    icon: "groups"
                },
                {
                    path: "/conversations",
                    text: "Conversations",
                    icon: "conversation"
                },
                {
                    path: "/friends",
                    text: "Friends",
                    icon: "handshake"
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
        <div className={styles.logo}>
            logo
        </div>
        <div className={styles.links}>
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
        </div>
        {loggedUser && <Notifications />}
        {loggedUser
            ? <LoggedUser user={loggedUser} />
            : <div className={styles.empty}></div>}
    </nav>
}

export default Navbar;
