import styles from "./Profile.module.css";
import Sidebar from "./sidebar/Sidebar";
import { Outlet } from "react-router";

const Profile = () => {
    return <main className={styles.profile}>
        <Sidebar />
        <Outlet />
    </main>
};

export default Profile;
