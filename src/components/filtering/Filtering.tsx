import styles from "./Filtering.module.css";
import { NavLink } from "react-router";

interface FilteringProps {
    to: string;
    currentSearch: string;
    searchParams: URLSearchParams;
    filteringText: string;
};

const Filtering = ({
    to,
    currentSearch,
    searchParams,
    filteringText
}: FilteringProps) => {
    return <div
        className={styles.filtering}
    >
        <h3>
            {filteringText} {currentSearch && `"${currentSearch}"`}
        </h3>
        <NavLink
            to={to}
            replace={true}
            onClick={() => searchParams.set("search", "")}
            className={styles["clear-search"]}
        >
            <span
                className="material-symbols-rounded"
            >
                close
            </span>
            <span>
                Clear filter
            </span>
        </NavLink>
    </div>
}

export default Filtering;
