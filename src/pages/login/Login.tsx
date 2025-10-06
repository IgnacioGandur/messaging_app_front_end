import styles from "./Login.module.css";
import { useState, useEffect, type ChangeEvent } from "react";
import { useFetcher, useNavigate } from "react-router";
import InputErrors from "../../components/input-errors/InputErrors";

const Login = () => {
    const fetcher = useFetcher();
    const navigate = useNavigate();
    const [userInputs, setUserInputs] = useState({
        username: "",
        password: ""
    });

    const loginResult = fetcher.data;

    const handleUserInputs = (e: ChangeEvent<HTMLInputElement>, inputField: string) => {
        setUserInputs((prevInputs) => ({
            ...prevInputs,
            [inputField]: e.target.value
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
        <fetcher.Form
            style={{
                display: "flex",
                flexDirection: "column",
                width: "400px"
            }}
            method="post"
        >
            <label htmlFor="username">
                Username
                <input
                    id="username"
                    name="username"
                    type="text"
                    value={userInputs.username}
                    onChange={(e) => handleUserInputs(e, "username")}
                />
            </label>
            <label htmlFor="password">
                Password
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={userInputs.password}
                    onChange={(e) => handleUserInputs(e, "password")}
                />
            </label>
            <button type="submit">Login</button>
        </fetcher.Form>
    </main>
}

export default Login;
