import { NavLink } from "react-router";
import Tooltip from "../../pages/dashboard/tooltip/Tooltip";
import styles from "./OnlineUsers.module.css";
import useOnlineUsers from "../../hooks/useOnlineUsers";
import ActiveIndicator from "../../mini-components/active-indicator/ActiveIndicator";

const OnlineUsers = () => {
    const {
        onlineUsers: users
    } = useOnlineUsers();

    return <div className={styles["online-users"]}>
        <Tooltip
            indicator={users.length > 9 ? "+9" : users.length}
            className={styles.tooltip}
            popoverTarget="online-users"
            anchorName="--online-users-anchor"
            ariaText="Show online users"
            icon="globe"
        >
            <ul className={styles["users-container"]}>
                {users.map((user) => {
                    return <NavLink
                        key={user.userId}
                        to={`/users/${user.userId}`}
                        className={styles.user}
                    >
                        <ActiveIndicator
                            style={{
                                position: "absolute",
                                bottom: ".1rem",
                                left: ".1rem",
                            }}
                        />
                        <img
                            title={`${user.username} is online.`}
                            className={styles.ppf}
                            src={user.profilePictureUrl}
                            alt={user.username}
                        />
                    </NavLink>
                })}
            </ul>
        </Tooltip>
    </div>
}

export default OnlineUsers;
