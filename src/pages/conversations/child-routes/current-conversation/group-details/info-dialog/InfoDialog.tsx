import styles from "./InfoDialog.module.css";

// Components
import InputErrors from "../../../../../../components/input-errors/InputErrors";
import CustomInput from "../../../../../../components/custom-input/CustomInput";
import SubmitionLoader from "../../../../../../components/submition-loader/SubmitionLoader";

// Types
import { NavLink, type FetcherWithComponents } from "react-router";
import type Group from "../../../../../../types/group";

// Packages
import { useState } from "react";
import { format } from "date-fns";

interface InfoDialogProps {
    infoDialogRef: React.RefObject<HTMLDialogElement | null>;
    fetcher: FetcherWithComponents<any>;
    loggedUserIsOwner: boolean;
    isEditing: boolean;
    toggleGroupEdit: () => void;
    toggleGroupInfo: () => void;
    group: Group;
};

const InfoDialog = ({
    infoDialogRef,
    fetcher,
    loggedUserIsOwner,
    toggleGroupInfo,
    group
}: InfoDialogProps) => {
    const groupOwner = group.participants.find((p) => p.role === "OWNER");
    const [isEditing, setIsEditing] = useState(false);
    const [updatedGroup, setUpdatedGroup] = useState({
        ppf: group.profilePicture,
        title: group.title,
        description: group.description
    });

    const toggleGroupEdit = () => {
        setIsEditing((prev) => !prev);
    };

    const handleGroupUpdatedFields = (
        field: string,
        value: string,
    ) => {
        setUpdatedGroup((prevFields) => ({
            ...prevFields,
            [field]: value
        }))
    };

    const isUpdatingGroup = fetcher.state === "submitting"
        && fetcher?.formData?.get("intent") === "update-group-info";
    const updateWasSuccessfull = fetcher.data && fetcher.data.success;
    const updateFailed = fetcher.data && !fetcher.data.success && isEditing;
    const isUpdateButtonDisabled = updatedGroup.ppf === group.profilePicture && updatedGroup.title === group.title && updatedGroup.description === group.description;

    return <dialog
        ref={infoDialogRef}
        className={styles["info-dialog"]}
    >
        <div className={styles["info-container"]}>
            {isUpdatingGroup ? (
                <SubmitionLoader
                    message="blablabla"
                />
            ) : (
                <>
                    {updateWasSuccessfull && (
                        <div
                            className={styles["success-update"]}
                        >
                            <span
                                className={`material-symbols-rounded ${styles.icon}`}
                            >
                                check_circle
                            </span>
                            <span
                                className={styles.text}
                            >
                                Group info updated successfully!
                            </span>
                        </div>
                    )}
                    {loggedUserIsOwner && (
                        !isEditing && (
                            <button
                                onClick={toggleGroupEdit}
                                className={styles.edit}
                            >
                                <span className="material-symbols-rounded">
                                    edit
                                </span>
                            </button>
                        )
                    )}
                    <button
                        className={styles.close}
                        onClick={toggleGroupInfo}
                    >
                        <span
                            className="material-symbols-rounded"
                        >
                            close
                        </span>
                    </button>
                    <div className={styles["group-ppf"]}>
                        <div className={styles["outer-wrapper"]}>
                            <div className={styles["inner-wrapper"]}>
                                <img
                                    src={group.profilePicture}
                                    alt={`${group.title}'s profile picture.`}
                                    className={styles.ppf}
                                />
                            </div>
                        </div>
                    </div>
                    {updateFailed && (
                        <InputErrors
                            message={fetcher.data.message}
                            errors={fetcher.data.errors}
                        />
                    )}
                    {isEditing ? (
                        <fetcher.Form
                            method="PATCH"
                            className={styles["edit-form"]}
                        >
                            <input
                                type="hidden"
                                name="intent"
                                value="update-group-info"
                            />
                            <h2>
                                Updating group info
                            </h2>
                            <CustomInput
                                id="edit-ppf"
                                name="ppf"
                                type="url"
                                labelText="Update group's profile picture URL."
                                googleIcon="media_link"
                                value={String(updatedGroup.ppf)}
                                onChange={handleGroupUpdatedFields}
                                placeholder="Group profile picture URL here..."
                                required={false}
                            />
                            <CustomInput
                                id="edit-title"
                                name="title"
                                type="text"
                                labelText="Update group's title"
                                googleIcon="edit_square"
                                value={String(updatedGroup.title)}
                                onChange={handleGroupUpdatedFields}
                                placeholder="Group title here..."
                                required={false}
                            />
                            <CustomInput
                                id="edit-description"
                                name="description"
                                type="text"
                                labelText="Update group's description"
                                googleIcon="edit_note"
                                value={!updatedGroup.description ? "" : String(updatedGroup.description)}
                                onChange={handleGroupUpdatedFields}
                                placeholder="Group title here..."
                                required={false}
                            />
                            <div
                                className={styles.buttons}
                            >
                                <button
                                    className={styles.button}
                                    type="button"
                                    onClick={toggleGroupEdit}
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={isUpdateButtonDisabled}
                                    className={styles.button}
                                >
                                    Update
                                </button>
                            </div>
                        </fetcher.Form>
                    ) : (
                        <>
                            <h2
                                className={styles.title}
                            >
                                {group.title}
                            </h2>
                            <p
                                className={styles.description}
                            >
                                {!group.description ? "This group doesn't have a description yet." : group.description}
                            </p>
                            <p
                                className={`${styles["participants-n"]} ${styles.field}`}
                            >
                                <span
                                    className={`material-symbols-rounded ${styles.icon}`}
                                >
                                    groups
                                </span>
                                <span
                                    className={styles.text}
                                >
                                    {group.participants.length} Participants
                                </span>
                            </p>
                            <p
                                className={`${styles.date} ${styles.field}`}
                            >

                                <span
                                    className={`material-symbols-rounded ${styles.icon}`}
                                >
                                    calendar_month
                                </span>
                                <span
                                    className={styles.text}
                                >
                                    {format(group.createdAt, "LLLL do, yyyy")}
                                </span>
                            </p>
                        </>
                    )}
                    <div
                        className={styles.separator}
                    >
                    </div>
                    {groupOwner && (
                        <>
                            <p>
                                Group owner
                            </p>
                            <NavLink
                                title="Go to group owner's profile"
                                viewTransition
                                to={`/users/${groupOwner.userId}`}
                                className={styles["group-owner"]}
                            >
                                <h3
                                    className={styles.name}
                                >
                                    {groupOwner.user.firstName} {groupOwner.user.lastName}
                                </h3>
                                <img
                                    className={styles["owner-ppf"]}
                                    src={groupOwner.user.profilePictureUrl}
                                >
                                </img>
                                <p
                                    className={styles.username}
                                >
                                    @{groupOwner.user.username}
                                </p>
                            </NavLink>
                        </>
                    )}
                </>
            )}
        </div>
    </dialog>
};

export default InfoDialog;
