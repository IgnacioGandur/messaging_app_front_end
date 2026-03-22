import styles from "./Dashboard.module.css";
import { useState } from "react";
import { useFetcher, useLoaderData } from "react-router";
import CurrentPageHeader from "../../components/current-page-header/CurrentPageHeader";
import Section from "./section/Section";
import type User from "../../types/user";
import CustomInput from "../../components/custom-input/CustomInput";
import Tooltip from "./tooltip/Tooltip";
import { format } from "date-fns";
import InputErrors from "../../components/input-errors/InputErrors";
import type InputError from "../../types/InputErrors";
import UpdateProfilePictureForm from "../../mini-components/update-profile-picture-form/UpdateProfilePictureForm";

interface ActionData {
    success: boolean;
    message: string;
    user?: User;
    errors?: InputError;
}

interface LoaderData {
    success: boolean;
    message: string;
    user: User;
    data: {
        friends: number;
        groupConversations: number;
        privateConversations: number;
        sentMessages: number;
    };
}

interface FieldsType {
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
}

const Dashboard = () => {
    const fetcher = useFetcher();
    const actionData = fetcher.data as ActionData;
    const loaderData = useLoaderData() as LoaderData;
    const user = loaderData.user;
    const name = user.firstName + " " + user.lastName;
    const { profilePictureUrl, username } = user;

    const [fields, setFields] = useState<FieldsType>({
        firstName: user.firstName,
        lastName: user.lastName,
        password: "",
        confirmPassword: "",
    });

    const handleFieldsUpdate = (field: string, value: string) => {
        setFields((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const deleteAccount = () => {
        fetcher.submit(
            {
                intent: "delete-account",
            },
            {
                method: "DELETE",
            },
        );
    };

    const isUpdatingProfilePicture =
        fetcher.state !== "idle" &&
        fetcher.formData?.get("intent")?.toString() ===
            "update-profile-picture";

    const isUpdatingUserProfile =
        fetcher.state !== "idle" &&
        fetcher.formData?.get("intent")?.toString() === "update-profile-info";

    const isDeletingAccount =
        fetcher.state !== "idle" &&
        fetcher.formData?.get("intent")?.toString() === "delete-account";

    return (
        <main className={styles.dashboard}>
            {actionData && !actionData?.success && (
                <InputErrors
                    className={styles["input-errors"]}
                    message={fetcher.data?.message}
                    errors={fetcher.data?.errors}
                />
            )}
            <CurrentPageHeader
                icon="dashboard"
                text="Dashboard"
                altClassName={styles.header}
            />
            <Section
                icon="ar_on_you"
                title="You"
                className={styles["current-profile"]}
                headerChildren={
                    <Tooltip
                        icon="delete"
                        ariaText="Delete your account"
                        className={styles["delete-account"]}
                        tooltipClassName={styles["delete-tooltip"]}
                    >
                        <div className={styles.wrapper}>
                            {isDeletingAccount ? (
                                <div className={styles["delete-loader"]}>
                                    <h4 className={styles.title}>
                                        Deleting your account, please wait...
                                    </h4>
                                    <div
                                        className={styles["spinner-container"]}
                                    >
                                        <span
                                            className={`material-symbols-rounded ${styles.icon}`}
                                        >
                                            progress_activity
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h4 className={styles.title}>
                                        Are you sure you want to delete your
                                        account?
                                    </h4>
                                    <p className={styles.para}>
                                        (This action will delete everything
                                        related to your account)
                                    </p>
                                    <button
                                        onClick={deleteAccount}
                                        className={styles.confirm}
                                    >
                                        Yes
                                    </button>
                                </>
                            )}
                        </div>
                    </Tooltip>
                }
            >
                <div className={styles["profile-wrapper"]}>
                    <h3 className={styles.name}>{name}</h3>
                    {isUpdatingProfilePicture ? (
                        <div className={styles.ring}>
                            <div className={styles.wrapper}>
                                <div
                                    className={styles["profile-picture-loader"]}
                                >
                                    <span
                                        className={`
                                material-symbols-rounded
                                ${styles.ppf}
                                ${styles.icon}
                            `}
                                    >
                                        progress_activity
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.ring}>
                            <div className={styles.wrapper}>
                                <img
                                    className={styles.ppf}
                                    src={profilePictureUrl}
                                    alt={name}
                                />
                                <Tooltip
                                    popoverTarget="update-profile-picture"
                                    anchorName="--update-ppf-anchor"
                                    className={styles.tooltip}
                                    icon="edit"
                                    ariaText="Update your profile picture"
                                >
                                    <UpdateProfilePictureForm
                                        title="Update your profile picture"
                                        altFetcher={fetcher}
                                    />
                                </Tooltip>
                            </div>
                        </div>
                    )}
                    <p className={styles.username}>@{username}</p>
                    <p className={styles["join-date"]}>
                        {format(user.joinedOn, "do MMMM, yyyy")}
                    </p>
                </div>
            </Section>
            <Section
                icon="person_edit"
                title="Update Your Profile"
                className={styles["update-profile"]}
                contentClassName={styles["inputs-container"]}
            >
                {isUpdatingUserProfile ? (
                    <div className={styles["update-profile-loader"]}>
                        <span
                            className={`material-symbols-rounded ${styles.icon}`}
                        >
                            progress_activity
                        </span>
                    </div>
                ) : (
                    <fetcher.Form
                        method="PATCH"
                        className={styles.form}
                    >
                        <input
                            type="hidden"
                            name="intent"
                            value="update-profile-info"
                        />
                        {Object.entries(fields).map(([key, value]) => {
                            let icon: string = "";

                            switch (key) {
                                case "firstName":
                                    icon = "id_card";
                                    break;
                                case "lastName":
                                    icon = "signature";
                                    break;
                                case "password":
                                    icon = "lock";
                                    break;
                                case "confirmPassword":
                                    icon = "lock_reset";
                                    break;
                            }

                            return (
                                <CustomInput
                                    key={key}
                                    name={key}
                                    id={key}
                                    type={
                                        /password/i.test(key)
                                            ? "password"
                                            : "text"
                                    }
                                    labelText={key.split(/(?=[A-Z])/).join(" ")}
                                    googleIcon={icon}
                                    value={value}
                                    onChange={handleFieldsUpdate}
                                    required={!/password/i.test(key)}
                                />
                            );
                        })}
                        <p className={styles["password-message"]}>
                            (Leave the passwords fields blank if you don't want
                            to update your password)
                        </p>
                        <button
                            type="submit"
                            className={styles.update}
                        >
                            <span className="material-symbols-rounded">
                                edit
                            </span>
                            <span className={styles.text}>Update</span>
                        </button>
                    </fetcher.Form>
                )}
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
                        case key.includes("friend"):
                            icon = "handshake";
                            break;
                        case key.includes("groupConversations"):
                            icon = "group";
                            break;
                        case key.includes("private"):
                            icon = "conversation";
                            break;
                        case key.includes("private"):
                            icon = "conversation";
                            break;
                        case key.includes("owned"):
                            icon = "group_work";
                            break;
                        default:
                            icon = "comic_bubble";
                    }

                    return (
                        <div
                            key={key}
                            className={styles.stat}
                        >
                            <div className={styles.header}>
                                <span
                                    className={`
                            material-symbols-rounded
                            ${styles.icon}
                        `}
                                >
                                    {icon}
                                </span>
                                <span className={styles.number}>{value}</span>
                            </div>
                            <h3 className={styles.text}>
                                {key.split(/(?=[A-Z])/).join(" ")}
                            </h3>
                        </div>
                    );
                })}
            </Section>
        </main>
    );
};

export default Dashboard;
