import { useEffect, useRef } from "react";
import styles from "./MainSidebar.module.css";
import logo from "../../assets/images/icon.svg";
import { useRouteLoaderData } from "react-router";
import { NavLink } from "react-router";
import type RootLoaderDataProps from "../../types/rootLoaderData";
import { BarLoader } from "react-spinners";
import argentina from "../../assets/images/argentina.svg";

interface MainSidebarProps {
    showSidebar: boolean;
    toggleSidebar: () => void;
};

interface Link {
    path: string;
    text: string;
    icon: string;
};

const MainSidebar = ({
    showSidebar,
    toggleSidebar
}: MainSidebarProps) => {
    const loaderData = useRouteLoaderData("root") as RootLoaderDataProps;
    const { user } = loaderData;
    const sidebarRef = useRef<HTMLDivElement | null>(null);

    const commonLinks = [
        user ? {
            path: "/dashboard",
            text: "Dashboard",
            icon: "dashboard"
        } : {
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

    const links: Link[] = commonLinks.concat(
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
                {
                    path: "/groups",
                    text: "Groups",
                    icon: "communities"
                },
                {
                    path: "/profile",
                    text: "Profile",
                    icon: "settings"
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

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (showSidebar && sidebarRef.current) {
                if (!sidebarRef.current.contains(e.target as Node)) {
                    toggleSidebar();
                }
            }
        };

        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
        }
    }, [showSidebar, toggleSidebar]);

    return showSidebar ? <aside
        ref={sidebarRef}
        className={styles["main-sidebar"]}
    >
        <div className={styles["logo-container"]}>
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
            <button
                onClick={toggleSidebar}
                className={styles["hide-sidebar"]}
            >
                <span className="material-symbols-rounded">
                    arrow_left_alt
                </span>
            </button>
        </div>
        <ul className={styles.links}>
            {links.map((link: Link) => {
                return <NavLink
                    prefetch="intent"
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) => isActive
                        ? `${styles.active} ${styles.link}`
                        : `${styles.link} ${link.text === "About" && styles.about}`
                    }
                    viewTransition
                >
                    {({ isPending }) => isPending ? (
                        <div className={styles["container"]}>
                            <BarLoader
                                className={styles.loader}
                                color={"var(--color-secondary)"}
                            />
                        </div>
                    ) : (
                        <>
                            <span className={`material-symbols-rounded ${styles.icon}`}>
                                {link.icon}
                            </span>
                            <div className={styles.separator}></div>
                            <span className={styles.text}>
                                {link.text}
                            </span>
                        </>
                    )}
                </NavLink>
            })}
        </ul>
        <div className={styles.info}>
            <p className={styles.author}>
                Made by Ignacio Gandur
            </p>
            <img
                className={styles.argentina}
                src={argentina}
                alt="Argentina's flag"
            />
        </div>
    </aside> : <button
        onClick={toggleSidebar}
        className={styles["show-sidebar"]}
    >
        <span className="material-symbols-rounded">
            menu
        </span>
    </button>
};

export default MainSidebar;
