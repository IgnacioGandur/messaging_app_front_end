import styles from "./Register.module.css";
import { useState, useEffect, type ChangeEvent } from "react";
import { useFetcher, useNavigation, useNavigate } from "react-router";
import InputErrors from "../../components/input-errors/InputErrors";

const Register = () => {
    const fetcher = useFetcher();
    const navigation = useNavigation();
    const navigate = useNavigate();
    const [userInputs, setUserInputs] = useState({
        username: "",
        password: "",
        confirmPassword: "",
    });

    const handleUserInput = (e: ChangeEvent<HTMLInputElement>, inputField: string) => {
        setUserInputs((prevInputs) => ({
            ...prevInputs,
            [inputField]: e.target.value
        }))
    };

    const registerResult = fetcher.data;

    useEffect(() => {
        if (fetcher?.data?.success) {
            navigate("/");
        };
    }, [fetcher.data]);

    // TODO: Figure out how to handle the cookie.

    return <main className={styles["register"]}>
        {registerResult && !registerResult.success ? <InputErrors message={registerResult.message} errors={registerResult.errors} /> : null}
        {navigation.state === "submitting" ? (
            <p>
                Submitting...
            </p>
        ) : (
            <fetcher.Form
                method="post"
                style={{
                    width: "300px",
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                <label htmlFor="username">
                    Username
                    <input
                        type="text"
                        id="username"
                        name="username"
                        onChange={(e) => handleUserInput(e, "username")}
                        value={userInputs.username}
                    />
                </label>
                <label htmlFor="password">
                    Password
                    <input
                        type="password"
                        id="password"
                        name="password"
                        onChange={(e) => handleUserInput(e, "password")}
                        value={userInputs.password}
                    />
                </label>
                <label htmlFor="confirm-password">
                    Confirm Password
                    <input
                        type="password"
                        id="confirm-password"
                        name="confirmPassword"
                        onChange={(e) => handleUserInput(e, "confirmPassword")}
                        value={userInputs.confirmPassword}
                    />
                </label>
                <button
                    type="submit"
                >
                    Register
                </button>
            </fetcher.Form>
        )}
    </main>
}

export default Register;
