import { NavLink } from "react-router";
import Tooltip from "../../pages/dashboard/tooltip/Tooltip";
import styles from "./OnlineUsers.module.css";
import socket from "../../socket";
import { useEffect, useState } from "react";

interface OnlineUser {
    userId: number;
    username: string;
    profilePictureUrl: string;
};

const OnlineUsers = () => {
    const [users, setUsers] = useState<OnlineUser[]>([]);

    useEffect(() => {
        socket.on("update_user_list", (usersArray) => {
            setUsers(usersArray);
        });

        return () => { socket.off("update_user_list") };
    }, []);

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
                        <div className={styles.indicator}></div>
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
