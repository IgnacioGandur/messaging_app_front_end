import InputErrors from "../../components/input-errors/InputErrors";
import type InputError from "../../types/InputErrors";
import styles from "./ServerErrorPage.module.css";
import {
    useRouteError,
    isRouteErrorResponse,
    NavLink,
    useRevalidator,
    useNavigate,
} from "react-router";

type BackendErrors = {
    success: boolean;
    message: string;
    errors: InputError[];
}

const ServerErrorPage = () => {
    const navigate = useNavigate();
    const error = useRouteError();
    const revalidator = useRevalidator();

    if (isRouteErrorResponse(error)) {
        const backendErrors: BackendErrors = JSON.parse(error.data);

        return <div className={styles.error}>
            {error.status < 500 ? (
                <div className={styles["errors-wrapper"]}>
                    {backendErrors.errors && (
                        <InputErrors
                            message="The server encountered an issue when processing your request."
                            errors={backendErrors.errors}
                        />
                    )}
                </div>
            ) : (
                <h2
                    className={styles["sub-title"]}
                >
                    Network error. We were not able to connect to the server.
                </h2>
            )}
            <header className={styles.oops}>
                {revalidator.state === "loading" ? (
                    <div className={styles["trying-again"]}>
                        <span className={`material-symbols-rounded ${styles.icon}`}>
                            sync
                        </span>
                        <span className={styles.text}>
                            Trying again...
                        </span>
                    </div>
                ) : (
                    <>
                        <h1
                            className={styles.title}
                        >
                            {error.status}
                        </h1>
                        <p
                            className={styles["status-text"]}
                        >{error.statusText}</p>
                        <span className={`material-symbols-rounded ${styles.icon}`}>
                            no_accounts
                        </span>
                    </>
                )}
            </header>
            <div className={styles.links}>
                <h2
                    className={styles.title}
                >
                    What would you like to do?
                </h2>
                <div className={styles["links-container"]}>
                    <div className={styles.link}>
                        <button
                            onClick={() => navigate(-1)}
                            className={styles.button}
                        >
                            <span className={`material-symbols-rounded ${styles.icon}`}>
                                arrow_left_alt
                            </span>
                        </button>
                        <span className={styles.text}>
                            Go Back
                        </span>
                    </div>
                    <div className={styles.link}>
                        <NavLink
                            className={styles.button}
                            to="/"
                        >
                            <span className={`material-symbols-rounded ${styles.icon}`}>
                                chair
                            </span>
                        </NavLink>
                        <span className={styles.text}>
                            Go Home
                        </span>
                    </div>
                    <div className={styles.link}>
                        <button
                            onClick={() => revalidator.revalidate()}
                            className={styles.button}
                        >
                            <span className={`material-symbols-rounded ${styles.icon}`}>
                                refresh
                            </span>
                        </button>
                        <span className={styles.text}>
                            Try again
                        </span>
                    </div>
                </div>
            </div>
        </div>
    }

    if (error instanceof Error) {
        return <div className={styles.error}>
            <h1>System error</h1>
            <p>
                {error.message}
            </p>
        </div>
    }
};

export default ServerErrorPage;
