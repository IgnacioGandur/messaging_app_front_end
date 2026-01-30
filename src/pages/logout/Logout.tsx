import styles from "./Logout.module.css";
import { useEffect } from "react";
import { useNavigate, useLoaderData } from "react-router";

const Logout = () => {
    const loaderData = useLoaderData();
    const navigate = useNavigate();

    useEffect(() => {
        if (loaderData.success) {
            navigate("/login");
        };
    }, [loaderData]);

    return <p className={styles["logout"]}>Logging out</p>
}

export default Logout;
