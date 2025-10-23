import styles from "./MessageForm.module.css";
import { Form } from "react-router";

type MessageFormProps = {
    handleMessage: (message: string) => void;
    message: string;
};

const MessageForm = ({
    handleMessage,
    message,
}: MessageFormProps) => {
    return <Form
        method="post"
        className={styles["send-message"]}
        encType="multipart/form-data"
    >
        <input
            className={styles.attachment}
            id="attachment"
            name="attachment"
            type="file"
        />
        <input
            id="message"
            type="text"
            name="message"
            placeholder="Send a message..."
            value={message}
            onChange={(e) => handleMessage(e.target.value)}
        />
        <button type="submit">
            <span className="material-symbols-rounded">
                send
            </span>
        </button>
    </Form>
};


export default MessageForm;
