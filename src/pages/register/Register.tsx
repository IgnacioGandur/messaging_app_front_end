import styles from "./Register.module.css";
import { useState, useEffect } from "react";
import { useFetcher, useNavigation, useNavigate, useSearchParams } from "react-router";
import InputErrors from "../../components/input-errors/InputErrors";
import Blob from "../../components/blob/Blob";
import CustomInput from "../../components/custom-input/CustomInput";
import FormButton from "../../components/form-button/FormButton";

const Register = () => {
    const fetcher = useFetcher();
    const [searchParams] = useSearchParams();
    const message = searchParams.get("message");
    const navigation = useNavigation();
    const navigate = useNavigate();
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
        }))
    };

    const registerResult = fetcher.data;

    useEffect(() => {
        if (fetcher?.data?.success) {
            navigate("/");
        };
    }, [fetcher.data]);

    return <main className={styles["register"]}>
        {message && (
            <p>{message}</p>
        )}
        {registerResult && !registerResult.success ? <InputErrors message={registerResult.message} errors={registerResult.errors} /> : null}
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
                {navigation.state === "submitting" ? (
                    <p>
                        Submitting...
                    </p>
                ) : (
                    <div className={styles["form-wrapper"]}>
                        <fetcher.Form
                            method="post"
                            className={styles.form}
                        >
                            <h2
                                className={styles.title}
                            >
                                Please fill in the fields.
                            </h2>
                            <div className={styles.names}>
                                <CustomInput
                                    id="first-name"
                                    name="firstName"
                                    type="text"
                                    labelText="First name"
                                    googleIcon="person"
                                    value={userInputs.firstName}
                                    onChange={handleUserInput}
                                    placeholder="John"
                                    minLength={3}
                                    maxLength={30}
                                    description="Between 3 and 30 characters. Only letters."
                                />
                                <CustomInput
                                    id="last-name"
                                    name="lastName"
                                    type="text"
                                    labelText="Last name"
                                    googleIcon="person"
                                    value={userInputs.lastName}
                                    onChange={handleUserInput}
                                    placeholder="Doe"
                                    minLength={3}
                                    maxLength={30}
                                    description="Between 3 and 30 characters. Only letters."
                                />
                            </div>
                            <CustomInput
                                id="username"
                                name="username"
                                type="text"
                                labelText="Username"
                                googleIcon="face"
                                value={userInputs.username}
                                onChange={handleUserInput}
                                placeholder="john_doe"
                                minLength={3}
                                maxLength={30}
                                description="Between 3 and 30 characters. Only letters, numbers, dots and hyphens."
                                pattern="[\w.-]{1,30}"
                            />
                            <div className={styles.passwords}>
                                <div className={styles.wrapper}>
                                    <CustomInput
                                        id="password"
                                        name="password"
                                        type="password"
                                        labelText="Password"
                                        googleIcon="lock"
                                        value={userInputs.password}
                                        onChange={handleUserInput}
                                        description="Choose a strong password"
                                    />
                                    <CustomInput
                                        id="confirm-password"
                                        name="confirmPassword"
                                        type="password"
                                        labelText="Confirm your password"
                                        googleIcon="lock_reset"
                                        value={userInputs.confirmPassword}
                                        onChange={handleUserInput}
                                        description="Repeat your password"
                                    />
                                </div>
                                <p className={`${styles.message} ${userInputs.password === "" || userInputs.confirmPassword === ""
                                    ? styles.message
                                    : userInputs.password !== userInputs.confirmPassword
                                        ? styles.match
                                        : styles["dont-match"]
                                    }`}>
                                    {userInputs.password === "" || userInputs.confirmPassword === ""
                                        ? "Waiting..."
                                        : userInputs.password !== userInputs.confirmPassword
                                            ? "The passwords don't match."
                                            : "Passwords match!"
                                    }
                                </p>
                            </div>
                            <FormButton
                                type="submit"
                                text="Register"
                                showGlow={false}
                            />
                        </fetcher.Form>
                    </div>
                )}
            </div>
        </div>
    </main>
}

export default Register;
