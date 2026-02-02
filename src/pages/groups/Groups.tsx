import styles from "./Groups.module.css";

// Packages
import {
    useEffect,
    useRef,
    useState,
} from "react";
import {
    useLoaderData,
    useRouteLoaderData,
    useFetcher,
    useNavigation,
    NavLink,
    useSearchParams,
} from "react-router";

// Types
import type Group from "../../types/group";

// Components
import InputErrors from "../../components/input-errors/InputErrors";
import SearchForm from "../../components/search-form/SearchForm";
import SubmitionLoader from "../../components/submition-loader/SubmitionLoader";
import CustomInput from "../../components/custom-input/CustomInput";
import PageLoader from "../../components/page-loader/PageLoader";
import PageLinks from "../../components/page-links/PageLinks";
import Filtering from "../../components/filtering/Filtering";
import EmptyResults from "../../components/empty-results/EmptyResults";
import SingleGroup from "./components/SingleGroup";

const navLinks: {
    to: string;
    text: string;
    icon: string;
    filterName: string;
}[] = [
        {
            to: "/groups?your-groups",
            text: "Your groups",
            icon: "stack_group",
            filterName: "your-groups"
        },
        {
            to: "/groups?joined",
            text: "Joined groups",
            icon: "view_apps",
            filterName: "joined"
        }
    ];

const Groups = () => {
    const navigation = useNavigation();
    const loggedUser = useRouteLoaderData("root");
    const loaderData = useLoaderData() as {
        success: boolean;
        message: string;
        data: {
            groups: Group[];
            meta: {
                count: number;
                currentPage: number;
                totalPages: number;
            }
        }
    };
    const groups: Group[] = loaderData?.data.groups;
    const groupsMetadata = loaderData?.data.meta;
    const fetcher = useFetcher();
    const [groupInfo, setGroupInfo] = useState({
        title: "",
        description: ""
    });

    const createGroupDialogRef = useRef<HTMLDialogElement | null>(null);
    const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false);
    const isLoading = navigation.state === "loading";
    const [searchParams] = useSearchParams();
    const currentSearch = searchParams.get("search") || "";
    const filteringByYourGroups = searchParams.has("your-groups");
    const filteringByJoinedGroups = searchParams.has("joined");

    const inputErrorsExist = fetcher.data && !fetcher.data?.success;
    const isCreatingGroup = fetcher.state === "submitting"
        && fetcher.formData!.get("intent") === "create-group";
    const isJoiningGroup = fetcher.state === "submitting"
        && fetcher.formData!.get("intent") === "join-group";
    const isLeavingGroup = fetcher.state === "submitting"
        && fetcher.formData!.get("intent") === "leave-group";

    const toggleGroupDialog = () => {
        setShowCreateGroupDialog((prev) => !prev);
    };

    const handleGroupInfo = (
        field: string,
        value: string
    ) => {
        setGroupInfo((prevInfo) => ({
            ...prevInfo,
            [field]: value
        }));
    };

    const handleFormSubmition = () => {
        if (!createGroupDialogRef.current) return;
        setShowCreateGroupDialog(false);
        setGroupInfo({ title: "", description: "" });
    };

    const joinGroup = (groupId: number) => {
        fetcher.submit(
            {
                intent: "join-group",
                groupId
            },
            {
                method: "post"
            },
        );
    };

    const leaveGroup = (
        userId: number,
        groupId: number
    ) => {
        fetcher.submit(
            {
                intent: "leave-group",
                userId,
                groupId
            },
            {
                method: "DELETE"
            },
        );
    };

    useEffect(() => {
        if (showCreateGroupDialog && createGroupDialogRef.current) {
            createGroupDialogRef.current?.showModal();
        } else {
            createGroupDialogRef.current?.close();
        }
    }, [createGroupDialogRef, showCreateGroupDialog]);

    return <main className={styles.groups}>
        {isCreatingGroup && <SubmitionLoader message="Creating group, please wait..." />}
        {isJoiningGroup && <SubmitionLoader message="Joining group, please wait..." />}
        {isLeavingGroup && <SubmitionLoader message="Leaving group, please wait..." />}
        <dialog
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
                    value={groupInfo.title}
                    onChange={handleGroupInfo}
                    placeholder="Group name..."
                    required={false}
                />
                <CustomInput
                    id="group-description"
                    name="description"
                    type="text"
                    labelText="Description"
                    googleIcon="draw"
                    value={groupInfo.description}
                    onChange={handleGroupInfo}
                    placeholder="Group name..."
                    required={false}
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
        <header className={styles.header}>
            <h1
                className={styles.title}
            >
                <span className={`material-symbols-rounded ${styles.icon}`}>
                    groups_3
                </span>
                <span className={styles.text}>
                    Groups
                </span>
            </h1>
            <div className={styles.buttons}>
                <button
                    className={styles.button}
                    onClick={toggleGroupDialog}
                >
                    <span className={`material-symbols-rounded ${styles.icon}`}>
                        add
                    </span>
                    <span className={styles.text}>
                        Create a group
                    </span>
                </button>
                {navLinks.map((l) => {
                    const isActuallyActive =
                        (l.filterName === "your-groups" && filteringByYourGroups) ||
                        (l.filterName === "joined" && filteringByJoinedGroups);

                    const isPending =
                        navigation.state === "loading" &&
                        (navigation.location.pathname + navigation.location.search) === l.to

                    return <NavLink
                        key={l.to}
                        to={l.to}
                        className={({ isActive }) =>
                            isActive && isActuallyActive
                                ? `${styles.active} ${styles.button}`
                                : styles.button
                        }
                    >
                        <span className={`material-symbols-rounded ${isPending
                            ? `${styles.pending} ${styles.icon}`
                            : styles.icon}`}>
                            {isPending ? "progress_activity" : l.icon}
                        </span>
                        <span className={styles.text}>
                            {l.text}
                        </span>
                    </NavLink>
                })}
            </div>
            <SearchForm
                currentSearch={currentSearch}
                labelText="Search groups by group name"
                usersAmout={`(${groups.length} ${groups.length !== 1 ? "groups" : "group"})`}
                placeholder="Programming"
            />
        </header>
        {(currentSearch || filteringByYourGroups || filteringByJoinedGroups) && <Filtering
            filteringText={currentSearch
                ? "Filtering groups by title:"
                : filteringByYourGroups
                    ? "Filtering by the groups you own"
                    : "Filtering by the groups you joined"}
            currentSearch={currentSearch}
            searchParams={searchParams}
            to="/groups"
        />}
        {inputErrorsExist && <InputErrors
            message={fetcher.data?.message}
            errors={fetcher.data?.errors}
        />}
        {isLoading
            ? <PageLoader message="Loading groups..." />
            : groups.length === 0
                ? <EmptyResults
                    currentSearch={currentSearch}
                    emptyDataIcon="group_off"
                    emptyDataMessage={filteringByYourGroups
                        ? "You are not the owner of any groups yet."
                        : filteringByJoinedGroups
                            ? "You haven't joined any groups yet."
                            : "Nobody has created a group yet."}
                    emptySearchResultMessage="No groups match the title:"
                    showRedirect={false}
                />
                : (
                    <section className={styles["groups-container"]}>
                        {groups.map((g) => {
                            return <SingleGroup
                                key={g.id}
                                group={g}
                                loggedUserId={loggedUser.user.id}
                                joinGroup={joinGroup}
                                leaveGroup={leaveGroup}
                            />
                        })}
                    </section>
                )}
        <PageLinks
            searchParams={searchParams}
            currentPage={groupsMetadata.currentPage}
            totalPages={groupsMetadata.totalPages}
            currentSearch={currentSearch}
        />
    </main>
}

export default Groups;
