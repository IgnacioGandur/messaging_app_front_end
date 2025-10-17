import styles from "./Groups.module.css";
import { useFetcher } from "react-router";
import { useState, type ChangeEvent, type FormEvent } from "react";

const Groups = () => {
    const fetcher = useFetcher();
    const [groupInfo, setGroupInfo] = useState({
        groupName: "",
    });

    const handleGroupInfo = (e: ChangeEvent<HTMLInputElement>, field: string) => {
        setGroupInfo((prevInfo) => ({
            ...prevInfo,
            [field]: e.target.value
        }));
    };

    const createGroup = (e: FormEvent) => {
        e.preventDefault();
        fetcher.submit(
            {
                intent: "create-group",
                groupName: groupInfo.groupName
            },
            {
                method: "POST",
            }
        )
    }

    return <main className={styles.groups}>
        <header className={styles["create-group"]}>
            <form
                onSubmit={createGroup}
                method="POST"
                className={styles.form}
            >
                <label htmlFor="group-name">
                    Group name
                    <input
                        id="group-name"
                        name="groupName"
                        type="text"
                        value={groupInfo.groupName}
                        onChange={(e) => handleGroupInfo(e, "groupName")}
                    />
                </label>
                <button type="submit">
                    <span className="material-symbols-rounded">
                        group_add
                    </span>
                    <span>
                        Create group
                    </span>
                </button>
            </form>
        </header>
    </main>
}

export default Groups;
