import styles from "./ActiveIndicator.module.css";

type ActiveIndicatorProps = {
    className?: string;
    text?: string;
    style?: React.CSSProperties;
};

const ActiveIndicator = ({
    className,
    text,
    style,
}: ActiveIndicatorProps) => {
    return <div
        title="This user is currently active"
        style={style}
        className={`${styles.indicator} ${className}`}
    >
        <span className={styles.dot}></span>
        {text && (
            <span className={styles.text}>{text}</span>
        )}
    </div>
}

export default ActiveIndicator;
