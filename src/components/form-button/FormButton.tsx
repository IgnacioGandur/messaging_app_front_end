import styles from "./FormButton.module.css";

interface FormButton {
    type: "submit" | "button";
    text: string;
    showGlow: boolean;
    disabled?: boolean;
    className?: string;
};

const FormButton = ({
    type,
    text,
    showGlow,
    disabled = false,
    className
}: FormButton) => {
    return <div className={`${styles["form-button"]} ${className}`}>
        <button
            title={disabled ? "The passwords must match to update your profile." : ""}
            disabled={disabled}
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
