import { useLoaderData } from "react-router";
import styles from "./Users.module.css"
import { useRouteLoaderData } from "react-router";

type User = {
    id: Number;
    username: string;
    firstName?: string;
    lastName?: string;
    joinedOn: Date;
};

const Users = () => {
    const loaderData = useLoaderData();
    const rootData = useRouteLoaderData("root");
    const users: User[] = loaderData?.users;

    return <main className={styles.users}>
        {users.length === 0 ? (
            <p>No users.</p>
        ) : (
            <ul className={styles.container}>
                {users.map((user: User) => {
                    return user.id === rootData.user.id ? null : <li
                        key={user.username}
                        className={styles.user}
                    >
                        <h3>
                            {user.username}
                        </h3>
                    </li>
                })}
            </ul>
        )}
    </main>
}

export default Users;
