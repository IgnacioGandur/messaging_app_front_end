import styles from "./Tooltip.module.css";

interface Tooltip {
    className: string;
    icon: string;
    ariaText: string;
};

const Tooltip = ({
    className,
    icon,
    ariaText,
    children
}: React.PropsWithChildren<Tooltip>) => {
    return <div
        className={`
            ${className}
            ${styles["tooltip-container"]}
        `}
    >
        <button
            className={styles.button}
            popoverTarget="update-ppf-tooltip"
            aria-label={ariaText}
        >
            <span className="material-symbols-rounded">
                {icon}
            </span>
        </button>
        <div
            popover="auto"
            id="update-ppf-tooltip"
            className={styles.tooltip}
        >
            {children}
        </div>
    </div>
}

export default Tooltip;
