import styles from "./GroupsSection.module.css";
import type User from "../../../../types/user";
import type Group from "../../../../types/group";
import { NavLink } from "react-router";

interface OwnedGroupsSectionProps {
    user: User;
    groups: Group[];
    headerTitle: string;
    gridArea: "owned-groups" | "joined-groups";
};

const OwnedGroupsSection = ({
    gridArea,
    headerTitle,
    groups,
}: OwnedGroupsSectionProps) => {
    return <section
        style={{
            gridArea
        }}
        className={styles["groups-section"]}
    >
        <header
            className={styles.header}
        >
            <span className={`material-symbols-rounded ${styles.icon}`}>
                group
            </span>
            <h3
                className={styles.text}
            >
                {headerTitle} groups ({groups.length})
            </h3>
        </header>
        {groups.length === 0 ? (
            <div className={styles["no-groups"]}>
                <span className="material-symbols-rounded">
                    group_off
                </span>
                <p className={styles.text}>
                    This user doesn't own any groups yet.
                </p>
            </div>
        ) : (
            <ul className={styles.container}>
                {groups.map(g => {
                    return <li
                        key={g.id}
                        className={styles.group}
                    >
                        <button
                            title="See group details."
                            className={`${styles.button} ${styles.anchor}`}
                            popoverTarget={`group-${g.id}`}
                        >
                            <img
                                className={styles.ppf}
                                src={g.profilePicture}
                                alt={g.title}
                            />
                        </button>
                        <div
                            popover="auto"
                            id={`group-${g.id}`}
                            className={styles["group-tooltip"]}
                        >
                            <NavLink
                                to={`/groups?search=${g.title.replaceAll(" ", "+")}`}
                                className={styles["content-wrapper"]}
                            >
                                <h4
                                    className={styles.title}
                                >
                                    {g.title}
                                </h4>
                                <img
                                    className={styles.ppf}
                                    src={g.profilePicture}
                                    alt={g.title}
                                />
                                <p
                                    className={styles.description}
                                >
                                    {g.description}
                                </p>
                            </NavLink>
                        </div>
                    </li>
                })}
            </ul>
        )}
    </section>
}

export default OwnedGroupsSection;
