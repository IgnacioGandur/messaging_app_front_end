import styles from "./SearchForm.module.css";
import { Form } from "react-router";

interface SearchFormProps {
    currentSearch: string;
    labelText: string;
    usersAmout: string;
};

const SearchForm = ({
    currentSearch,
    labelText,
    usersAmout,
}: SearchFormProps) => {
    return <Form
        key={currentSearch}
        method="GET"
        className={styles["search-form"]}
    >
        <span className={styles["users-amount"]}>
            {usersAmout}
        </span>
        <input
            type="hidden"
            name="page"
            value="1"
        />
        <label
            className={styles.label}
            htmlFor="search"
        >
            {labelText}
        </label>
        <input
            defaultValue={currentSearch}
            className={styles.input}
            id="search"
            type="text"
            name="search"
            placeholder="Username"
            required
        />
        <button
            className={styles["search-button"]}
        >
            Search
        </button>
    </Form>
};

export default SearchForm;
