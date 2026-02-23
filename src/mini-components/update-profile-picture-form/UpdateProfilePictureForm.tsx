import styles from "./UpdateProfilePictureForm.module.css";
import { useFetcher, type FetcherWithComponents } from "react-router";

interface UpdateProfilePictureFormProps {
    title: string;
    altFetcher?: FetcherWithComponents<any>;
};

const UpdateProfilePictureForm = ({
    title,
    altFetcher,
}: UpdateProfilePictureFormProps) => {
    const fetcher = altFetcher || useFetcher();

    return <fetcher.Form
        method="PUT"
        className={styles.form}
        encType="multipart/form-data"
    >
        <h2
            className={styles.title}
        >
            {title}
        </h2>
        <input
            type="hidden"
            name="intent"
            value="update-profile-picture"
        />
        <label
            className={styles.label}
            htmlFor="profile-picture"
        >
            Upload a picture from you PC
            <input
                accept="image/*"
                className={styles["file-input"]}
                id="profile-picture"
                name="profilePicture"
                type="file"
            />
        </label>
        <label
            className={styles.label}
            htmlFor="profile-picture-url"
        >
            Or use a URL to it
            <input
                className={styles.input}
                id="profile-picture-url"
                name="profilePictureUrl"
                type="url"
                placeholder="https://www.website.com/image.png"
            />
        </label>
        <p className={styles.clarification}>
            (If you provide both, the image from the file would be applied)
        </p>
        <button
            type="submit"
            className={styles["update-ppf-button"]}
        >
            Update
        </button>
    </fetcher.Form>
}

export default UpdateProfilePictureForm;
