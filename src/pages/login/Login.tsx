// Styles come from the register.module.css file because they are almost the same.
import styles from "../register/Register.module.css";
import { useState, useEffect } from "react";
import { useFetcher, useNavigate, useNavigation, useSearchParams } from "react-router";
import InputErrors from "../../components/input-errors/InputErrors";
import Blob from "../../components/blob/Blob";
import CustomInput from "../../components/custom-input/CustomInput";
import FormButton from "../../components/form-button/FormButton";

const Login = () => {
    const fetcher = useFetcher();
    const navigate = useNavigate();
    const navigation = useNavigation();
    const [searchParams] = useSearchParams();
    const message = searchParams.get("message");
    const [userInputs, setUserInputs] = useState({
        username: "",
        password: ""
    });

    const loginResult = fetcher.data;

    const handleUserInputs = (field: string, value: string) => {
        setUserInputs((prevInputs) => ({
            ...prevInputs,
            [field]: value
        }));
    };

    useEffect(() => {
        if (loginResult?.success) {
            navigate("/");
        }

    }, [loginResult]);

    return <main className={styles["login"]}>
        {loginResult && (
            !loginResult?.success && <InputErrors message={loginResult?.message} errors={loginResult?.errors} />
        )}
        {message && (<p>{message}</p>)}

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
                {navigation.state === "idle"
                    ? (
                        <div className={styles["form-wrapper"]}>
                            <fetcher.Form
                                method="post"
                                className={styles.form}
                            >
                                <h2
                                    className={`${styles.title} ${styles.login}`}
                                >
                                    Enter your username and password.
                                </h2>
                                <CustomInput
                                    id="username"
                                    name="username"
                                    type="text"
                                    labelText="Username"
                                    googleIcon="face"
                                    value={userInputs.username}
                                    onChange={handleUserInputs}
                                    placeholder="John_doe"
                                    required={true}
                                />
                                <CustomInput
                                    id="password"
                                    name="password"
                                    type="password"
                                    labelText="Password"
                                    googleIcon="key"
                                    value={userInputs.password}
                                    onChange={handleUserInputs}
                                    required={true}
                                />
                                <FormButton
                                    showGlow={true}
                                    text="Login"
                                    type="submit"
                                />
                            </fetcher.Form>
                        </div>
                    )
                    : (
                        <p>Submitting</p>
                    )}
            </div>
        </div>
    </main>
}

export default Login;
