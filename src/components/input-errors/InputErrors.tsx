import styles from "./InputErrors.module.css";

type Error = {
    msg: string;
    path: string;
};

type InputErrorsProps = {
    message: string;
    errors?: Error[];
    className?: string;
};

const InputErrors = ({
    message,
    errors,
    className
}: InputErrorsProps) => {
    return <section
        className={`${styles["input-errors"]} ${className}`}
    >
        <h3 className={styles["message"]}>
            {message}
        </h3>
        {errors && (
            <ul className={styles["errors"]}>
                {errors.map((error) => {
                    return <li
                        key={error.path}
                        className={styles["error"]}
                    >
                        {error.msg}
                    </li>
                })}
            </ul>
        )}
    </section>
}

export default InputErrors;
