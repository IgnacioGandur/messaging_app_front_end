import { useEffect, useRef, useState } from "react";
import styles from "./Settings.module.css";
import { useFetcher, useRouteLoaderData, useNavigate } from "react-router";
import InputErrors from "../../../../components/input-errors/InputErrors";

const Settings = () => {
    const fetcher = useFetcher();
    const loaderData = useRouteLoaderData("root");
    const user = loaderData?.user;
    const modalRef = useRef<HTMLDialogElement>(null);
    const navigate = useNavigate();

    const profileUpdateResult = fetcher.data;

    const [userInputs, setUserInputs] = useState({
        username: user.username,
        firstName: user.firstName === null ? "" : user.firstName,
        lastName: user.lastName === null ? "" : user.lastName,
        password: "",
        confirmPassword: "",
    });

    const handleUserInputs = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setUserInputs((prevInputs) => ({
            ...prevInputs,
            [field]: e.target.value
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
        <dialog
            ref={modalRef}
            className={styles["delete-account-modal"]}
        >
            <fetcher.Form
                method="post"
            >
                <input
                    type="hidden"
                    name="intent"
                    value="delete-account"
                />
                <button type="submit">
                    Yes
                </button>
            </fetcher.Form>
            <button
                onClick={closeModal}
            >
                No
            </button>
        </dialog>
        {profileUpdateResult && !profileUpdateResult?.success ? <InputErrors message={profileUpdateResult?.message} errors={profileUpdateResult?.errors} /> : <p>{
            profileUpdateResult?.message
        }</p>}
        <fetcher.Form
            method="post"
            style={{
                width: "300px",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <label htmlFor="username">
                Update username
                <input
                    id="username"
                    type="text"
                    name="username"
                    value={userInputs.username}
                    onChange={(e) => handleUserInputs(e, "username")}
                />
            </label>
            <label htmlFor="first-name">
                Update first name
                <input
                    id="first-name"
                    type="text"
                    name="firstName"
                    value={userInputs.firstName}
                    onChange={(e) => handleUserInputs(e, "firstName")}
                />
            </label>
            <label htmlFor="last-name">
                Update last name
                <input
                    id="last-name"
                    type="text"
                    name="lastName"
                    value={userInputs.lastName}
                    onChange={(e) => handleUserInputs(e, "lastName")}
                />
            </label>
            <label htmlFor="password">
                Update password
                <input
                    id="password"
                    type="password"
                    name="password"
                    value={userInputs.password}
                    onChange={(e) => handleUserInputs(e, "password")}
                />
            </label>
            <label htmlFor="confirm-password">
                Confirm password
                <input
                    id="confirm-password"
                    type="password"
                    name="confirmPassword"
                    value={userInputs.confirmPassword}
                    onChange={(e) => handleUserInputs(e, "confirmPassword")}
                />
            </label>
            {userInputs.password !== userInputs.confirmPassword && <p>
                The passwords don't match.
            </p>}
            <button
                disabled={userInputs.password !== userInputs.confirmPassword}
                type="submit"
            >
                Update
            </button>
        </fetcher.Form>
        <button
            onClick={showModal}
        >
            Delete account?
        </button>
    </section>
}

export default Settings;
