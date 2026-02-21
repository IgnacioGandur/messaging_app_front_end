import styles from "./Dashboard.module.css";
import { useState } from "react";
import { useFetcher, useLoaderData } from "react-router";
import CurrentPageHeader from "../../components/current-page-header/CurrentPageHeader";
import Section from "./section/Section";
import type User from "../../types/user";
import CustomInput from "../../components/custom-input/CustomInput";
import Tooltip from "./tooltip/Tooltip";

interface LoaderData {
    success: boolean;
    message: string;
    user: User;
    data: {
        friends: number;
        groupConversations: number;
        privateConversations: number;
        sentMessages: number;
    }
};

interface FieldsType {
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
}

const Dashboard = () => {
    const fetcher = useFetcher();
    const loaderData = useLoaderData() as LoaderData;
    const user = loaderData.user;
    const name = user.firstName + " " + user.lastName;
    const {
        profilePictureUrl,
        username
    } = user;

    const [fields, setFields] = useState<FieldsType>({
        firstName: user.firstName,
        lastName: user.lastName,
        password: "",
        confirmPassword: ""
    });

    const handleFieldsUpdate = (
        field: string,
        value: string,
    ) => {
        setFields((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    return <main className={styles.dashboard}>
        <CurrentPageHeader
            icon="dashboard"
            text="Dashboard"
            altClassName={styles.header}
        />
        <Section
            icon="ar_on_you"
            title="You"
            className={styles["current-profile"]}
        >
            <h3
                className={styles.name}
            >
                {name}
            </h3>
            <div className={styles.ring}>
                <div className={styles.wrapper}>
                    <img
                        className={styles.ppf}
                        src={profilePictureUrl}
                        alt={name}
                    />
                    <Tooltip
                        className={styles.tooltip}
                        icon="edit"
                        ariaText="Update your profile picture"
                    >
                        <fetcher.Form
                            className={styles.form}
                        >
                            <label
                                className={styles.label}
                                htmlFor="profile-picture"
                            >
                                Update your profile picture
                                <input
                                    className={styles.input}
                                    id="profile-picture"
                                    name="updatedPpf"
                                    type="file"
                                />
                            </label>
                            <button>Update</button>
                        </fetcher.Form>
                    </Tooltip>
                </div>
            </div>
            <p className={styles.username}>
                @{username}
            </p>
        </Section>
        <Section
            icon="person_edit"
            title="Update Your Profile"
            className={styles["update-profile"]}
            contentClassName={styles["inputs-container"]}
        >
            <fetcher.Form
                method="PATCH"
                className={styles.form}
            >
                {Object.entries(fields).map(([key, value]) => {
                    let icon: string = "";

                    switch (key) {
                        case "firstName": icon = "id_card"; break;
                        case "lastName": icon = "signature"; break;
                        case "password": icon = "lock"; break;
                        case "confirmPassword": icon = "lock_reset"; break;
                    }

                    return <CustomInput
                        key={key}
                        name={key}
                        id={key}
                        type={/password/i.test(key) ? "password" : "text"}
                        labelText={key.split(/(?=[A-Z])/).join(" ")}
                        googleIcon={icon}
                        value={value}
                        onChange={handleFieldsUpdate}
                    />
                })}
                <button
                    type="submit"
                    className={styles.update}
                >
                    <span className="material-symbols-rounded">
                        edit
                    </span>
                    <span className={styles.text}>
                        Update
                    </span>
                </button>
            </fetcher.Form>
        </Section>
        <Section
            icon="query_stats"
            title="Stats"
            className={styles["profile-stats"]}
            contentClassName={styles["stats-container"]}
        >
            {Object.entries(loaderData.data).map(([key, value]) => {
                let icon: string;

                switch (true) {
                    case key.includes("friend"): icon = "handshake";
                        break;
                    case key.includes("groupConversations"): icon = "group";
                        break;
                    case key.includes("private"): icon = "conversation";
                        break;
                    case key.includes("private"): icon = "conversation";
                        break;
                    case key.includes("owned"): icon = "group_work";
                        break;
                    default: icon = "comic_bubble"
                }

                return <div
                    key={key}
                    className={styles.stat}
                >
                    <div className={styles.number}>
                        {value}
                    </div>
                    <span className={`material-symbols-rounded ${styles.icon}`}>
                        {icon}
                    </span>
                    <h3
                        className={styles.text}
                    >
                        {key.split(/(?=[A-Z])/).join(" ")}
                    </h3>
                </div>
            })}
        </Section>
    </main>
};

export default Dashboard;
