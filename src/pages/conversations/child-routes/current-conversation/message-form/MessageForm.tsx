import styles from "./MessageForm.module.css";
import { useFetcher } from "react-router";
import CustomInput from "../../../../../components/custom-input/CustomInput";
import { SyncLoader } from "react-spinners";

type MessageFormProps = {
    setMessage: React.Dispatch<
        React.SetStateAction<{
            message: string;
            attachment: File | null
        }>
    >;
    handleMessage: (field: string, value: string) => void;
    message: string;
};

const MessageForm = ({
    handleMessage,
    setMessage,
    message,
}: MessageFormProps) => {
    const fetcher = useFetcher();

    return fetcher.state === "submitting" ? (
        <div className={styles.loader}>
            <SyncLoader
                color="var(--light-dark-font)"
                size=".6rem"
                className={styles.animation}
            />
            <p
                className={styles.text}
            >
                Sending message...
            </p>
        </div>
    ) :
        (<fetcher.Form
            method="post"
            className={styles["send-message"]}
            encType="multipart/form-data"
        >
            <input
                type="hidden"
                name="intent"
                value="send-message"
            />
            <label
                title="Attach a file to the message"
                htmlFor="attachment"
                className={styles.attachment}
            >
                <span className={`material-symbols-rounded ${styles.icon}`}>
                    attach_file_add
                </span>
                <input
                    className={styles.attachment}
                    id="attachment"
                    name="attachment"
                    type="file"
                    onChange={(e) => {
                        const file = e.target.files?.[0] ?? null

                        setMessage((prev) => ({
                            ...prev,
                            attachment: file
                        }));
                    }}
                />
            </label>
            <CustomInput
                id="message"
                name="message"
                type="text"
                value={message}
                onChange={handleMessage}
                placeholder="Send a message..."
                minLength={1}
                required={true}
            />
            <button
                className={styles["submit-button"]}
                type="submit"
            >
                <span className="material-symbols-rounded">
                    arrow_upward_alt
                </span>
            </button>
        </fetcher.Form>
        )
};


export default MessageForm;
