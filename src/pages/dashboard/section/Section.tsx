import styles from "./Section.module.css";

interface SectionProps {
    icon: string;
    title: string;
    className?: string;
    contentClassName?: string;
    headerChildren?: React.ReactNode;
};

const Section = ({
    icon,
    title,
    className,
    contentClassName,
    headerChildren,
    children
}: React.PropsWithChildren<SectionProps>) => {
    return <section className={`${styles["section"]} ${className}`}>
        <header
            className={styles.header}
        >
            <span className={`material-symbols-rounded ${styles.icon}`}>
                {icon}
            </span>
            <h2
                className={styles.title}
            >
                {title}
            </h2>
            {headerChildren}
        </header>
        <div className={`${styles.content} ${contentClassName}`}>
            {children}
        </div>
    </section>
};

export default Section;
