import styles from "./ActiveIndicator.module.css";

type ActiveIndicatorProps = {
    text?: string;
    style?: React.CSSProperties;
};

const ActiveIndicator = ({
    text,
    style,
}: ActiveIndicatorProps) => {
    return <div
        title="This user is currently active"
        style={style}
        className={styles.indicator}
    >
        <span className={styles.dot}></span>
        {text && (
            <span className={styles.text}>{text}</span>
        )}
    </div>
}

export default ActiveIndicator;
