import styles from "./Logout.module.css";
import { useEffect } from "react";
import { useNavigate, useLoaderData } from "react-router";

const Logout = () => {
    const loaderData = useLoaderData();
    console.log("the content of loaderData is:", loaderData);
    const navigate = useNavigate();

    useEffect(() => {
        if (loaderData.success) {
            navigate("/");
        };
    }, [loaderData]);

    return <p className={styles["logout"]}>Logging out</p>
}

export default Logout;
