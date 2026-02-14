import type { FetcherWithComponents } from "react-router";
import CustomInput from "../../../components/custom-input/CustomInput";
import styles from "./CreateGroupDialog.module.css";

interface CreateGroupDialogProps {
    createGroupDialogRef: React.RefObject<HTMLDialogElement | null>;
    fetcher: FetcherWithComponents<any>;
    handleFormSubmition: () => void;
    toggleGroupDialog: () => void;
    groupTitle: string,
    groupDescription: string,
    handleGroupInfo: (field: string, value: string) => void;
}

const CreateGroupDialog = ({
    createGroupDialogRef,
    fetcher,
    handleFormSubmition,
    groupTitle,
    groupDescription,
    toggleGroupDialog,
    handleGroupInfo
}: CreateGroupDialogProps) => {
    return <dialog
        ref={createGroupDialogRef}
        className={styles["create-group-dialog"]}
    >
        <fetcher.Form
            method="POST"
            className={styles.wrapper}
            onSubmit={handleFormSubmition}
        >
            <button
                type="button"
                className={styles.close}
                onClick={toggleGroupDialog}
            >
                <span className="material-symbols-rounded">
                    close
                </span>
            </button>
            <div className={styles.text}>
                <h2>Create your own group!</h2>
                <p>What is your group about? Let us know in the description!</p>
            </div>
            <input
                name="intent"
                value="create-group"
                type="hidden"
            />
            <CustomInput
                id="group-title"
                name="title"
                type="text"
                labelText="Name"
                googleIcon="draw"
                value={groupTitle}
                onChange={handleGroupInfo}
                placeholder="Group name..."
                required={true}
            />
            <CustomInput
                id="group-description"
                name="description"
                type="text"
                labelText="Description"
                googleIcon="draw"
                value={groupDescription}
                onChange={handleGroupInfo}
                placeholder="Group name..."
                required={true}
            />
            <button
                type="submit"
                className={styles.create}
            >
                <span className="material-symbols-rounded">
                    group_add
                </span>
                <span>
                    Create group
                </span>
            </button>
        </fetcher.Form>
    </dialog>
}

export default CreateGroupDialog;

