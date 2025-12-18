import styles from "./CustomInput.module.css";
import { useState } from "react";

interface CustomInputProps {
    name: string;
    id: string;
    type: "text" | "password";
    labelText: string;
    googleIcon: string;
    value: string;
    onChange: (field: string, value: string) => void;
    placeholder?: string;
    minLength?: number;
    maxLength?: number;
    description?: string;
    pattern?: string;
    required?: boolean;
};

const CustomInput = ({
    id,
    name,
    type,
    labelText,
    googleIcon,
    value,
    onChange,
    placeholder,
    minLength,
    maxLength,
    description,
    pattern,
    required = true,
}: CustomInputProps) => {

    const [showPassword, setShowPassword] = useState(type === "password" ? true : false);

    const togglePassword = () => {
        setShowPassword((prevState) => !prevState);
    };

    return <div className={styles["custom-input"]}>
        <label
            htmlFor={id}
            className={styles.label}
        >
            <div className={styles["label-text"]}>
                <span className={styles.indicator}></span>
                <p className={styles.text}>
                    {labelText}
                </p>
                <div className={styles["feedback-icon"]}>
                    <span className={`material-symbols-rounded ${styles["success-indicator"]}`}>
                        check_circle
                    </span>
                    <span className={`material-symbols-rounded ${styles["error-indicator"]}`}>
                        error
                    </span>
                </div>
            </div>
            <div className={styles.wrapper}>
                <div className={styles.icon}>
                    <span className="material-symbols-rounded">
                        {googleIcon}
                    </span>
                </div>
                <input
                    id={id}
                    className={styles.input}
                    type={showPassword ? "password" : "text"}
                    name={name}
                    value={value}
                    onChange={(e) => onChange(name, e.target.value)}
                    placeholder={placeholder}
                    minLength={minLength}
                    maxLength={maxLength}
                    pattern={pattern}
                    required={required}
                />
                {type === "password" && (
                    <button
                        onClick={togglePassword}
                        className={styles["toggle-password"]}
                        type="button"
                    >
                        <span className="material-symbols-rounded">
                            {showPassword ? "visibility" : "visibility_off"}
                        </span>
                    </button>
                )}
            </div>
            <p className={styles.description}>
                {description}
            </p>
        </label>
    </div>
};

export default CustomInput;
