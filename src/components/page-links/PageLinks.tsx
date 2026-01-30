import styles from "./PageLinks.module.css";
import { NavLink } from "react-router";

interface PageLinksProps {
    currentSearch: string;
    searchParams: URLSearchParams;
    currentPage: number;
    totalPages: number;
};

const PageLinks = ({
    currentSearch,
    searchParams,
    currentPage,
    totalPages
}: PageLinksProps) => {
    const createPagePath = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        return `?${params.toString()}`;
    };
    return totalPages > 1 && (<nav className={styles.pages}>
        {currentPage > 1 && (
            <NavLink
                to={createPagePath(currentPage - 1)}
                className={styles.previous}
            >
                <span className={styles.text}>
                    Previous page
                </span>
                <span className="material-symbols-rounded">
                    arrow_back
                </span>
            </NavLink>
        )}
        {Array.from({ length: totalPages }, (_, i) => {
            const pageNum = i + 1;
            const pagePath = createPagePath(pageNum);

            const isActive = location.search === pagePath ||
                (location.search === "" && pageNum === 1 && !currentSearch);

            return <NavLink
                key={pageNum}
                to={pagePath}
                className={isActive ? `${styles.active} ${styles.link}` : styles.link}
            >
                {pageNum}
            </NavLink>
        })}
        {currentPage < totalPages && (
            <NavLink
                to={createPagePath(currentPage + 1)}
                className={styles.next}
            >
                <span className={styles.text}>
                    Next page
                </span>
                <span className="material-symbols-rounded">
                    arrow_forward
                </span>
            </NavLink>
        )}
    </nav>)
};

export default PageLinks;
