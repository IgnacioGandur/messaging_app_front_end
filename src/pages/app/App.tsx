import styles from "./App.module.css";

// Packages
import { Outlet } from "react-router";
import { useRouteLoaderData } from "react-router";

// Components
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import ServerError from "../../components/server-error/ServerError";

const App = () => {
    const loaderData = useRouteLoaderData("root");
    console.log(loaderData);

    return <div className={styles["app"]}>
        {loaderData?.error && <ServerError
            title="Server Error"
            message={loaderData?.message}
        />}
        <Navbar />
        <Outlet />
        <Footer />
    </div>
}

export default App;
