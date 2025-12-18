import { useRouteLoaderData, NavLink } from "react-router";
import styles from "./Navbar.module.css";
import { BarLoader } from "react-spinners";
import LoggedUser from "./LoggedUser";
import Notifications from "./Notifications";
import logo from "../../assets/images/icon.svg";
import logoDark from "../../assets/images/icon_dark.svg";

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
                    icon: "signature"
                },
                {
                    path: "/login",
                    text: "Login",
                    icon: "login"
                },
            ]
    );

    return <nav className={styles.navbar}>
        <div className={styles["logo-container"]}>
            <picture>
                <source srcSet={logoDark} media="(prefers-color-scheme:dark)" />
                <img className={styles.logo} src={logo} alt="Website icon" />
            </picture>
            <h2 className={styles.name}>Chateá!</h2>
        </div>
        <div className={styles.links}>
            {links.map((link: Link) => {
                return <NavLink
                    prefetch="intent"
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) => isActive
                        ? `${styles.active} ${styles.link}`
                        : styles.link}
                    viewTransition
                >
                    {({ isPending }) => isPending ? <BarLoader color="#fff" /> : (
                        <>
                            <span className={`material-symbols-rounded ${styles.icon}`}>
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
