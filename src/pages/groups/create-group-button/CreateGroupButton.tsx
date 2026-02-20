import { useFetcher } from "react-router";
import styles from "./CreateGroupButton.module.css";
import CustomInput from "../../../components/custom-input/CustomInput";
import { useState } from "react";

interface BasicGroupInfo {
    title: string;
    description: string;
};

const CreateGroupButton = () => {
    const fetcher = useFetcher();
    const popoverTarget = "create-group";
    const [group, setGroup] = useState<BasicGroupInfo>({
        title: "",
        description: ""
    });

    const handleGroupInfo = (
        field: string,
        value: string,
    ) => {
        setGroup((prev) => ({
            ...prev,
            [field]: value
        }));
    }

    const isCreatingGroup = fetcher.state !== "idle"
        && fetcher.formData?.get("intent")?.toString() === "create-group";

    return <div
        className={styles["create-group"]}
    >
        <button
            aria-label="Create group"
            title="Create group"
            popoverTarget={popoverTarget}
            className={styles.button}
        >
            <span className={`material-symbols-rounded ${styles.icon}`}>
                add
            </span>
        </button>
        <div
            popover="auto"
            id={popoverTarget}
            className={styles.tooltip}
        >
            <div className={styles.wrapper}>
                {isCreatingGroup ? (
                    <div className={styles.loader}>
                        <p>
                            Creating group, please wait...
                        </p>
                        <span className={`material-symbols-rounded ${styles.icon}`}>
                            progress_activity
                        </span>
                    </div>
                ) : (
                    <fetcher.Form
                        method="POST"
                        className={styles.form}
                    >
                        <h2
                            className={styles.title}
                        >
                            Create your own group!
                        </h2>
                        <p
                            className={styles["sub-title"]}
                        >
                            What is your group about? Let us know in the description!
                        </p>
                        <input type="hidden" name="intent" value="create-group" />
                        <CustomInput
                            id="group-title"
                            name="title"
                            type="text"
                            minLength={3}
                            maxLength={150}
                            labelText="Title"
                            description="Give a descriptive title so users can search for it!"
                            googleIcon="draw"
                            value={group.title}
                            onChange={handleGroupInfo}
                            placeholder="Group name..."
                            required={true}
                        />
                        <CustomInput
                            id="group-description"
                            name="description"
                            type="text"
                            labelText="Description"
                            description="Provide a small and clear description so users know what you group is about!"
                            googleIcon="draw"
                            value={group.description}
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
                )}
            </div>
        </div>
    </div>
}

export default CreateGroupButton;
