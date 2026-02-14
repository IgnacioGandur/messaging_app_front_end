import styles from "./Register.module.css";

// Packages
import { useEffect, useState } from "react";
import {
    useSearchParams,
    Form,
    useNavigation,
    useActionData,
    useNavigate
} from "react-router";

// Components
import InputErrors from "../../components/input-errors/InputErrors";
import Blob from "../../components/blob/Blob";
import CustomInput from "../../components/custom-input/CustomInput";
import FormButton from "../../components/form-button/FormButton";
import { Submitter } from "../login/Login";

//Types
import type { RegisterActionResponseType } from "./registerAction";


const Register = () => {
    const navigate = useNavigate();
    const navigation = useNavigation();
    const actionData = useActionData() as RegisterActionResponseType;
    const [searchParams] = useSearchParams();
    const message = searchParams.get("message");
    const [userInputs, setUserInputs] = useState({
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        confirmPassword: "",
    });

    const handleUserInput = (field: string, value: string) => {
        setUserInputs((prevInputs) => ({
            ...prevInputs,
            [field]: value
        }));
    };

    const isSubmittingForm = navigation.state === "submitting";
    const registerResult = actionData;
    const hasInputErrors = registerResult && ("errors" in registerResult);

    useEffect(() => {
        if (actionData && actionData.success) {
            navigate("/", { replace: true });
        }
    }, [actionData])

    return <main className={styles["register"]}>
        {message && (
            <p>{message}</p>
        )}
        {hasInputErrors
            && <InputErrors
                message={registerResult.message}
                errors={registerResult.errors}
            />}
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.deco}>
                    <div className={styles["title-container"]}>
                        <h1
                            className={styles.title}
                        >
                            Create an account now!
                        </h1>
                    </div>
                    <div className={styles["blob-container"]}>
                        <div className={styles.background}></div>
                        <div className={styles["blob-wrapper"]}>
                            <Blob
                                onlyGlow={true}
                            />
                        </div>
                    </div>
                </div>
                {isSubmittingForm ? (
                    <Submitter text="Registering, please wait..." />
                ) : (
                    <div className={styles["form-wrapper"]}>
                        <Form
                            method="POST"
                            className={styles.form}
                        >
                            <h2
                                className={styles.title}
                            >
                                Please fill in the fields.
                            </h2>
                            {Object.entries(userInputs).map(([key, value]) => {
                                let placeholder: string = "Placeholder";
                                const type = key === "password" || key === "confirmPassword" ? "password" : "text";
                                let icon: string = "info";
                                let minLength: number = 1;
                                let maxLength: number = 30;
                                let description: string = "Description";
                                let pattern: string = ".{1,}";
                                switch (key) {
                                    case "firstName": {
                                        icon = "person";
                                        placeholder = "John"
                                        minLength = 1;
                                        maxLength = 30;
                                        description = "Between 1 and 30 characters long, only letters."
                                        pattern = "[a-zA-Z]{1,30}"
                                    }
                                        break;
                                    case "lastName": {
                                        icon = "signature";
                                        placeholder = "Doe"
                                        minLength = 1;
                                        maxLength = 30;
                                        description = "Between 1 and 30 characters long, only letters."
                                        pattern = "[a-zA-Z]{1,30}"
                                    };
                                        break;
                                    case "username": {
                                        icon = "badge";
                                        placeholder = "john_doe"
                                        minLength = 3;
                                        maxLength = 30;
                                        description = "Between 3 and 30 characters long, only letters, numbers, dots and hyphens (-, _)."
                                        pattern = ".{3,30}"
                                    };
                                        break;
                                    case "password": {
                                        placeholder = "*******"
                                        icon = "passkey"
                                        description = "Pick a strong password."
                                    }
                                        break;
                                    case "confirmPassword": {
                                        placeholder = "*******"
                                        icon = "passkey"
                                        description = "Repeat your password."
                                    };
                                        break;
                                    default: {
                                        icon = "info";
                                        placeholder = "Placeholder"
                                    };
                                }
                                return <CustomInput
                                    key={key}
                                    id={key}
                                    name={key}
                                    type={type}
                                    labelText={key.split(/(?=[A-Z])/).join(" ")}
                                    googleIcon={icon}
                                    value={value}
                                    onChange={handleUserInput}
                                    placeholder={placeholder}
                                    minLength={minLength}
                                    maxLength={maxLength}
                                    description={description}
                                    pattern={pattern}
                                    required={true}
                                    className={styles[key]}
                                />
                            })}
                            <FormButton
                                className={styles.button}
                                type="submit"
                                text="Register"
                                showGlow={true}
                            />
                        </Form>
                    </div>
                )}
            </div>
        </div>
    </main>
}

export default Register;
