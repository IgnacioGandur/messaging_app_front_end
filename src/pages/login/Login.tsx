import styles from "../register/Register.module.css";

// Packages
import { useState } from "react";
import {
    useActionData,
    useFetcher,
    useSearchParams,
    useNavigation,
    Form
} from "react-router";

// Components
import InputErrors from "../../components/input-errors/InputErrors";
import Blob from "../../components/blob/Blob";
import CustomInput from "../../components/custom-input/CustomInput";
import FormButton from "../../components/form-button/FormButton";

import type { LoginResponseType } from "./loginAction";

export const Submitter = ({ text }: { text: string }) => {
    return <div className={styles.submitting}>
        <span className={`material-symbols-rounded ${styles.icon}`}>
            progress_activity
        </span>
        <p className={styles["submiting-message"]}>
            {text}
        </p>
    </div>
};

const Login = () => {
    const actionData = useActionData() as LoginResponseType;
    const navigation = useNavigation();

    const [searchParams] = useSearchParams();
    const message = searchParams.get("message");
    const [userInputs, setUserInputs] = useState({
        username: "",
        password: ""
    });

    const loginResult = actionData;
    let hasInputErrors = loginResult && "errors" in loginResult;
    const isSubmittingForm = navigation.state === "submitting";

    const handleUserInputs = (field: string, value: string) => {
        setUserInputs((prevInputs) => ({
            ...prevInputs,
            [field]: value
        }));
    };

    return <main className={styles["login"]}>
        {hasInputErrors && <InputErrors
            message={loginResult?.message}
            errors={loginResult?.errors} />}
        {message && (<p
            className={styles.message}
        >{message}</p>)}
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.deco}>
                    <div className={styles["title-container"]}>
                        <h1 className={styles.title}>
                            Welcome back!
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
                    <Submitter text="Login, please wait..." />
                ) : (
                    <div className={styles["form-wrapper"]}>
                        <Form
                            method="post"
                            className={styles.form}
                        >
                            <h2
                                className={`${styles.title} ${styles.login}`}
                            >
                                Enter your username and password.
                            </h2>
                            {Object.entries(userInputs).map(([key, value]) => {
                                return <CustomInput
                                    key={key}
                                    id={key}
                                    name={key}
                                    type={key === "password" ? "password" : "text"}
                                    labelText={key}
                                    googleIcon={key === "password" ? "key" : "badge"}
                                    value={value}
                                    onChange={handleUserInputs}
                                    placeholder={key === "password" ? "*****" : "john_doe"}
                                    required={true}
                                />
                            })}
                            <FormButton
                                showGlow={true}
                                text="Login"
                                type="submit"
                            />
                        </Form>
                    </div>
                )}
            </div>
        </div>
    </main >
}

export default Login;
