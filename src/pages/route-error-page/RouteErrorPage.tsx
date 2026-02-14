import styles from "./RouteErrorPage.module.css";
import {
    useRouteError,
    isRouteErrorResponse,
} from "react-router";

// FIX: Fix this page to correctly display rendering errors too.

interface RouteErrorPageProps {
    title: string;
};

const RouteErrorPage = ({
    title,
}: RouteErrorPageProps) => {
    const error = useRouteError();

    let errorMessage: string;
    let errorStatus: (number | string) = "Unknown";

    if (isRouteErrorResponse(error)) {
        errorMessage = error.data?.message || error.statusText;
        errorStatus = error.status;
    } else if (error instanceof Error) {
        errorMessage = error.message;

        if (error.message === "Failed to fetch" || error.name === "TypeError") {
            errorStatus = "Network error.";
            errorMessage = "We can't reach Chateá! servers. Is the backend running?";
        }
    } else if (typeof error === "string") {
        errorMessage = error;
    } else {
        console.error(error);
        errorMessage = "An unexpected error has occured.";
    }

    console.log(errorMessage);
    console.log(errorStatus);
    return <section
        className={styles.content}
    >
        <h1>{title}</h1>
    </section>
}

export default RouteErrorPage;
