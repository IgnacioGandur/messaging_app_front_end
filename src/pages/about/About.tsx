import styles from "./About.module.css";
import { toast } from "react-hot-toast";
import NotificationMessage from "../../mini-components/notification-message/NotificationMessage";

const About = () => {
    const onClick = () => {
        toast.custom(
            <NotificationMessage
                isGroup={true}
                to="/conversations/1"
                name={"My group conversation"}
                profilePictureUrl="https://images8.alphacoders.com/699/thumb-440-699136.webp"
                message="Hello dude!"
                icon="mail"
                senderName={"Ignacio Gandur"}
            />
        );
    };

    return <main className={styles.about}>
        <button
            onClick={onClick}
        >
            call notification.
        </button>
        <NotificationMessage
            isGroup={true}
            to="/conversations/1"
            name={"My group conversation"}
            profilePictureUrl="https://images8.alphacoders.com/699/thumb-440-699136.webp"
            message="lsdjfosijfpaio jfpaosidj paosijd fasfjaslkfj posdijf po"
            icon="mail"
            senderName={"Ignacio Gandur"}
        />
        <NotificationMessage
            isGroup={false}
            to="/conversations/1"
            name={"Ignacio Gandur"}
            profilePictureUrl="https://images8.alphacoders.com/699/thumb-440-699136.webp"
            message="Private message"
            icon="mail"
        />
        <div className={styles.box}>
            <div className={styles.child}></div>
        </div>
    </main>
};

export default About;
