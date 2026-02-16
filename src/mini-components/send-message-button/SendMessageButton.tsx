import styles from "./SendMessageButton.module.css";
import CustomInput from "../../components/custom-input/CustomInput";
import { Form } from "react-router";

interface SendMessageButtonProps {
    message: string,
    handleMessage: (field: string, value: string) => void;
    className?: string;
    style?: React.CSSProperties;
    anchorName?: string;
    popoverTarget?: string;
    incluceMessageRecipientId?: boolean;
    messageRecipientId?: number;
};

const SendMessageButton = ({
    message,
    handleMessage,
    className,
    style,
    anchorName,
    popoverTarget,
    incluceMessageRecipientId,
    messageRecipientId
}: SendMessageButtonProps) => {
    return <div
        style={{ ...style, anchorName: anchorName }}
        className={`${className} ${styles["message-button"]}`}
    >
        <button
            className={styles.button}
            popoverTarget={`${popoverTarget || "message-form-wrapper "}`}
            aria-describedby="message-tooltip"
        >
            <span className={`material-symbols-rounded ${styles.icon}`}>
                comic_bubble
            </span>
        </button>
        <p
            id="message-tooltip"
            role="tooltip"
            className={styles.tooltip}
        >
            Send Message
        </p>
        <div
            className={styles["message-form-wrapper"]}
            popover="auto"
            id={`${popoverTarget || "message-form-wrapper "}`}
            style={{
                positionAnchor: anchorName
            }}
        >
            <Form
                method="post"
                className={styles["message-form"]}
            >
                {incluceMessageRecipientId && (
                    <>
                        <input
                            type="hidden"
                            name="recipientId"
                            value={messageRecipientId}
                        />
                    </>
                )}
                <input
                    type="hidden"
                    name="intent"
                    value="send-message"
                />
                <CustomInput
                    name="message"
                    id="message"
                    type="text"
                    labelText="Send your message!"
                    googleIcon="send"
                    value={message}
                    onChange={handleMessage}
                    placeholder="Hello! Nice to meet you!"
                    minLength={1}
                    maxLength={125}
                    required={true}
                />
                <button
                    className={styles.button}
                >
                    Send message
                </button>
            </Form>
        </div>
    </div >
}

export default SendMessageButton;

