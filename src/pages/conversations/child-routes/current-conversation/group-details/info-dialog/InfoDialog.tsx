import styles from "./InfoDialog.module.css";

// Components
import InputErrors from "../../../../../../components/input-errors/InputErrors";
import CustomInput from "../../../../../../components/custom-input/CustomInput";
import SubmitionLoader from "../../../../../../components/submition-loader/SubmitionLoader";

// Types
import { NavLink, type FetcherWithComponents } from "react-router";
import type Group from "../../../../../../types/group";

// Packages
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
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
    const [updatedGroup, setUpdatedGroup] = useState<{
        ppf: string,
        title: string,
        description: string,
    }>({
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
        }));
    };


    const isUpdatingGroup = fetcher.state === "submitting"
        && fetcher?.formData?.get("intent") === "update-group-info";
    const updateFailed = fetcher.data && !fetcher.data.success && isEditing;
    const isUpdateButtonDisabled = updatedGroup.ppf === group.profilePicture && updatedGroup.title === group.title && updatedGroup.description === group.description;

    useEffect(() => {
        if (isUpdatingGroup) {
            toast.loading("Updating group, please wait...", { id: "group-update" });
            return;
        }

        if (fetcher.state === "idle" && fetcher.data) {
            toast.dismiss("group-update");

            if (fetcher.data?.success) {
                toast.success(fetcher.data.message) || "Success!";
            } else {
                toast.error("The group update failed.");
            }
        }
    }, [fetcher.data, fetcher.state, isUpdatingGroup]);

    return <dialog
        ref={infoDialogRef}
        className={styles["info-dialog"]}
    >
        <div className={styles["info-container"]}>
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
                    {Object.entries(updatedGroup).map(([key, value]) => {
                        let labelText: string = "";
                        let googleIcon: string = "";
                        let placeholder: string = "";
                        let description: string = "";

                        switch (key) {
                            case "ppf": {
                                labelText = "Profile Picture URL";
                                googleIcon = "media_link";
                                placeholder = "https://website.com/image.png";
                                description = "Pick a nice profile picture for your group!";
                                break;
                            }
                            case "title": {
                                labelText = "Group's title"
                                googleIcon = "edit_square"
                                placeholder = "Programming group.";
                                description = "Give your group an inviting title";
                                break;
                            }
                            case "description": {
                                labelText = "Group's description"
                                googleIcon = "edit_note"
                                placeholder = "We talk about programmin here!";
                                description = "Tell user's what is you group about!";
                                break;
                            }
                        }

                        return <CustomInput
                            key={key}
                            name={key}
                            id={key}
                            type="text"
                            labelText={labelText}
                            googleIcon={googleIcon}
                            value={value}
                            onChange={handleGroupUpdatedFields}
                            placeholder={placeholder}
                            minLength={1}
                            description={description}
                            required={true}
                        />
                    })}
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
        </div>
    </dialog>
};

export default InfoDialog;
