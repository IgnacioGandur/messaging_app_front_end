import styles from "./EmptyResults.module.css";
import { NavLink } from "react-router";

interface EmptyResultsProps {
    to?: string;
    currentSearch: string;
    emptySearchResultMessage: string;
    emptyDataMessage: string;
    emptyDataIcon: string;
    showRedirect: boolean;
    redirectText?: string;
};

const EmptyResults = ({
    to = "/",
    currentSearch,
    emptySearchResultMessage,
    emptyDataMessage,
    emptyDataIcon,
    showRedirect,
    redirectText
}: EmptyResultsProps) => {
    return <div className={styles["empty-results"]}>
        <span className={`material-symbols-rounded ${styles.icon}`}>
            {currentSearch ? "search_off" : emptyDataIcon}
        </span>
        <div className={styles.text}>
            <h2
                className={styles.title}
            >
                {currentSearch ? `${emptySearchResultMessage} "${currentSearch}".` : emptyDataMessage}
            </h2>
            {(showRedirect && !currentSearch) && (
                <p
                    className={styles.paragraph}
                >
                    {redirectText}
                    {" "}
                    <NavLink
                        to={to}
                        className={styles.link}
                    >
                        here
                    </NavLink>
                </p>
            )}
        </div>
    </div>
};

export default EmptyResults;
