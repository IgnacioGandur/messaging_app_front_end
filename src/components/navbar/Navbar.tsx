import { useRouteLoaderData, NavLink } from "react-router";
import styles from "./Navbar.module.css";
import { BarLoader } from "react-spinners";
import LoggedUser from "./logged-user/LoggedUser";
import Notifications from "./Notifications";
import logo from "../../assets/images/icon.svg";

type Link = {
    path: string;
    text: string;
};

const Navbar = () => {
    const loaderData = useRouteLoaderData("root");
    const loggedUser = loaderData?.user;

    const links = [
        {
            path: "/",
            text: "Home",
        },
        {
            path: "/register",
            text: "Register",
        },
        {
            path: "/login",
            text: "Login",
        },
    ];

    return <nav
        id="navbar"
        className={styles.navbar}
    >
        <div className={styles["icon-container"]}>
            <div className={styles["image-container"]}>
                <div className={styles.mask}></div>
                <img
                    className={styles.image}
                    src={logo}
                    alt="Website's logo"
                />
            </div>
            <h2 className={styles.title}>
                Chateá
            </h2>
        </div>
        {!loaderData?.user && (
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
                        {({ isPending }) => isPending ? (
                            <BarLoader
                                className={styles.loader}
                                color={"var(--color-main)"}
                            />
                        ) : (
                            <span className={styles.text}>
                                {link.text}
                            </span>
                        )}
                    </NavLink>
                })}
            </div>
        )}
        {loggedUser && <div className={styles["notifications-and-user"]}>
            <Notifications />
            <LoggedUser user={loggedUser} />
        </div>}
    </nav>
}

export default Navbar;
