import styles from "./Tooltip.module.css";

interface Tooltip {
    indicator?: string | number;
    popoverTarget?: string;
    anchorName?: string;
    className?: string;
    icon: string;
    ariaText: string;
};

const Tooltip = ({
    indicator,
    popoverTarget = "default",
    anchorName = "--anchor",
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
        {indicator && (
            <span className={styles.indicator}>
                {indicator}
            </span>
        )}
        <button
            style={{
                anchorName: anchorName,
            }}
            title={ariaText}
            className={styles.button}
            popoverTarget={popoverTarget}
            aria-label={ariaText}
        >
            <span className="material-symbols-rounded">
                {icon}
            </span>
        </button>
        <div
            style={{
                positionAnchor: anchorName
            }}
            popover="auto"
            id={popoverTarget}
            className={styles.tooltip}
        >
            {children}
        </div>
    </div>
}

export default Tooltip;
