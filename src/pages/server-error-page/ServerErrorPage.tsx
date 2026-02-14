import styles from "./ServerErrorPage.module.css";
import {
    useRouteError,
    isRouteErrorResponse,
    NavLink,
    useRevalidator,
    useNavigate,
} from "react-router";

const ServerErrorPage = () => {
    let message: string = "Seems like an error happened in the app, please try again later...";
    let status: string | number = 500;
    let statusText: string = "Server Error";
    const navigate = useNavigate();
    const revalidator = useRevalidator();
    const error = useRouteError();
    const isBackendDown = error instanceof Error;
    const isBackendThrowingError = isRouteErrorResponse(error);
    const isTryingAgain = revalidator.state === "loading";

    if (isBackendThrowingError) {
        message = error.data.message;
        status = error.status;
        statusText = error.statusText;
    } else if (isBackendDown) {
        message = "We can't reach our servers right now. Please try again in a few minutes.";
    }

    return <section className={styles.error}>
        <h1 className={styles.oops}>
            Oops!
            <span className={`material-symbols-rounded ${styles.icon}`}>
                {isBackendThrowingError
                    ? "error"
                    : isBackendDown
                        ? "cloud_off"
                        : "bomb"}
            </span>
        </h1>
        <div className={styles.container}>
            <h2
                className={styles.title}
            >
                The server encountered an issue while processing your request.
            </h2>
            <p className={styles.message}>
                {message}
            </p>
        </div>
        {isTryingAgain ? (
            <div className={styles["trying-again"]}>
                <span className={`material-symbols-rounded ${styles.icon}`}>
                    sync
                </span>
                <span className={styles.text}>
                    Trying again...
                </span>
            </div>
        ) : (
            <div className={styles.status}>
                <p className={styles.code}>
                    {status}
                </p>
                {statusText && (
                    <span className={styles.text}>
                        {statusText}
                    </span>
                )}
            </div>
        )}
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
    </section>
}

export default ServerErrorPage;
