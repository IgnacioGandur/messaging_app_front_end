import styles from "./FormButton.module.css";

interface FormButton {
    type: "submit" | "button";
    text: string;
    showGlow: boolean;
};

const FormButton = ({
    type,
    text,
    showGlow
}: FormButton) => {
    return <div className={styles["form-button"]}>
        <button
            type={type}
            className={styles.button}
        >
            {text}
        </button>
        {showGlow && (
            <div className={styles.glow}>
                glow
            </div>
        )}
    </div>
};

export default FormButton;
