// Packages
import { useEffect, useRef, useState } from "react";
import styles from "./Settings.module.css";
import { useFetcher, useRouteLoaderData, useNavigate } from "react-router";
import { format } from "date-fns";

// Components
import CustomInput from "../../../../components/custom-input/CustomInput";
import FormButton from "../../../../components/form-button/FormButton";
import InputErrors from "../../../../components/input-errors/InputErrors";

// Types
import type RootLoaderDataProps from "../../../../types/rootLoaderData";
import type User from "../../../../types/user";
import type { FetcherWithComponents } from "react-router";
import SubmitionLoader from "../../../../components/submition-loader/SubmitionLoader";

// Interfaces
interface UserInputs extends Omit<User, "joinedOn" | "id" | "username"> {
    password: string;
    confirmPassword: string;
}

interface CurrentProfileProps {
    user: User;
    showModal: () => void;
};

interface DeleteAccountDialogProps {
    modalRef: React.RefObject<HTMLDialogElement | null>;
    fetcher: FetcherWithComponents<any>,
    closeModal: () => void;
};

interface UpdateProfileFormProps {
    fetcher: FetcherWithComponents<any>;
    userInputs: UserInputs;
    handleUserInputs: (field: string, value: string) => void;
};

const DeleteAccountDialog = ({
    modalRef,
    fetcher,
    closeModal,
}: DeleteAccountDialogProps) => {
    return <dialog
        ref={modalRef}
        className={styles["delete-account-modal"]}
    >
        <fetcher.Form
            method="DELETE"
            className={styles["delete-form"]}
        >
            <h2>Are you sure you want to delete your account?</h2>
            <p
                className={styles["sub-title"]}
            >This will delete all your messages, friendships, conversations, and groups.</p>
            <span className={`${styles.icon} material-symbols-rounded`}>
                bomb
            </span>
            <input
                type="hidden"
                name="intent"
                value="delete-account"
            />
            <div className={styles.buttons}>
                <button
                    type="button"
                    onClick={closeModal}
                >
                    No
                </button>
                <button type="submit">
                    Yes
                </button>
            </div>
        </fetcher.Form>
    </dialog>
};

const CurrentProfile = ({
    user,
    showModal
}: CurrentProfileProps) => {
    return <div className={styles["current-profile"]}>
        <h2
            className={styles.title}
        >
            <span className={`material-symbols-rounded ${styles.icon}`}>
                id_card
            </span>
            <span className={styles.text}>
                Your current profile
            </span>
        </h2>
        <img
            className={styles["current-ppf"]}
            src={user.profilePictureUrl}
            alt={`${user.firstName} ${user.lastName}'s profile picture.`}
        />
        <h3 className={styles.name}>
            {user.firstName} {user.lastName}
        </h3>
        <p className={styles.username}>
            @{user.username}
        </p>
        <div className={styles["join-date"]}>
            <span className={`material-symbols-rounded ${styles.icon}`}>
                calendar_today
            </span>
            <span className={styles.date}>
                Joined · {format(user.joinedOn, "LLLL io, yyyy")}
            </span>
        </div>
        <button
            className={styles["delete-account"]}
            onClick={showModal}
        >
            <span className="material-symbols-rounded">
                delete_forever
            </span>
        </button>
    </div>
};

const UpdateProfileForm = ({
    fetcher,
    userInputs,
    handleUserInputs
}: UpdateProfileFormProps) => {
    const orderedKeys = ["firstName", "lastName", "profilePictureUrl", "password", "confirmPassword"];
    return <div className={styles["form-wrapper"]}>
        <h2
            className={styles.title}
        >
            <span className={`material-symbols-rounded ${styles.icon}`}>
                person_edit
            </span>
            <span className={styles.text}>
                Update your profile details
            </span>
        </h2>
        <fetcher.Form
            className={styles.form}
            method="PATCH"
        >
            <input type="hidden" name="intent" value="update-profile" />
            {orderedKeys.map((key) => {
                const value = userInputs[key as keyof typeof userInputs];
                let icon: string = '';
                switch (key) {
                    case "username": icon = "face"
                        break;
                    case "firstName": icon = "person"
                        break;
                    case "lastName": icon = "signature"
                        break;
                    case "profilePictureUrl": icon = "ar_on_you"
                        break;
                    case "password":
                    case "confirmPassword": icon = "passKey"
                        break;
                    default: icon = "help"
                }

                return <CustomInput
                    key={key}
                    className={`${styles[key]} ${styles.input}`}
                    id={key}
                    name={key}
                    type={
                        (key === "password" || key === "confirmPassword")
                            ? "password"
                            : "text"
                    }
                    labelText={key.split(/(?=[A-Z])/).join(" ")}
                    googleIcon={icon}
                    value={value}
                    onChange={handleUserInputs}
                    required={(key === "password" || key === "confirmPassword") ? false : true}
                />
            })}
            {userInputs.password !== userInputs.confirmPassword && <p
                className={styles["passwords-message"]}
            >
                The passwords don't match.
            </p>}
            <FormButton
                className={styles.button}
                showGlow={true}
                text="Update"
                type="submit"
                disabled={userInputs.password !== userInputs.confirmPassword}
            />
        </fetcher.Form>
    </div>

};

const Settings = () => {
    const fetcher = useFetcher();
    const rootLoaderData = useRouteLoaderData("root") as RootLoaderDataProps;
    const user = rootLoaderData?.user;
    const modalRef = useRef<HTMLDialogElement>(null);
    const navigate = useNavigate();
    const isSubmitting = fetcher.state === "submitting";
    const updateResult = fetcher?.data?.success;
    const updateMessage = fetcher?.data?.message;

    const { joinedOn, id, username, ...userWithRemovedProps } = user;
    const finalUser = { ...userWithRemovedProps, confirmPassword: "", password: "" };

    const [userInputs, setUserInputs] = useState<UserInputs>(finalUser);

    const handleUserInputs = (field: string, value: string) => {
        setUserInputs((prevInputs) => ({
            ...prevInputs,
            [field]: value
        }))
    };

    const showModal = () => {
        if (modalRef.current) {
            modalRef.current.showModal();
        };
    };

    const closeModal = () => {
        if (modalRef.current) {
            modalRef.current.close();
        };
    };

    useEffect(() => {
        if (fetcher.data?.accountDeleted) {
            navigate("/register?message=" + encodeURIComponent(fetcher.data?.message))
        };
    }, [fetcher.data]);

    return <section className={styles.settings}>
        <DeleteAccountDialog
            closeModal={closeModal}
            fetcher={fetcher}
            modalRef={modalRef}
        />
        {isSubmitting && <SubmitionLoader
            message="Updating your profile, please wait..."
        />}
        {fetcher.data && (
            updateResult ? (
                <p
                    className={`${styles["update-result"]} ${styles.success}`}
                >
                    <span className="material-symbols-rounded">
                        check_circle
                    </span>
                    {updateMessage}
                </p>
            ) : (
                <InputErrors
                    className={styles["update-result"]}
                    message={fetcher.data.message}
                    errors={fetcher.data.errors}
                />
            )
        )}
        <h1
            className={`${styles.title} ${styles["main-title"]}`}
        >
            <span className={`material-symbols-rounded ${styles.icon}`}>
                settings
            </span>
            <span className={styles.text}>
                Profile Settings
            </span>
        </h1>
        <div className={styles.wrapper}>
            <CurrentProfile
                showModal={showModal}
                user={user}
            />
            <UpdateProfileForm
                fetcher={fetcher}
                handleUserInputs={handleUserInputs}
                userInputs={userInputs}
            />
        </div>
    </section>
}

export default Settings;
