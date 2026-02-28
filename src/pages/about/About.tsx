import styles from "./About.module.css";
import { toast } from "react-hot-toast";
import Notification from "../../mini-components/notification/Notification";

const About = () => {
    const onClick = (message: string) => {
        toast.custom(<Notification message={message} />);
    };

    return <main className={styles.about}>
        <button
            onClick={() => onClick("You have a friendship request!")}
        >
            call notification.
        </button>
        <div className={styles.box}>
            <div className={styles.child}></div>
        </div>
    </main>
};

export default About;
