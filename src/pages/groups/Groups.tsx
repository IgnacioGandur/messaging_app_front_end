import styles from "./Groups.module.css";

import {
    useLoaderData,
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
import PageLoader from "../../components/page-loader/PageLoader";
import PageLinks from "../../components/page-links/PageLinks";
import Filtering from "../../components/filtering/Filtering";
import EmptyResults from "../../components/empty-results/EmptyResults";
import SingleGroup from "./components/SingleGroup";
import CurrentPageHeader from "../../components/current-page-header/CurrentPageHeader";
import CreateGroupButton from "./create-group-button/CreateGroupButton";

interface GroupLoaderData {
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

const navLinks: {
    to: string;
    text: string;
    icon: string;
    filterName: string;
}[] = [
        {
            to: "/groups?your-groups",
            text: "Your groups",
            icon: "communities",
            filterName: "your-groups"
        },
        {
            to: "/groups?joined",
            text: "Joined groups",
            icon: "hive",
            filterName: "joined"
        }
    ];

const Groups = () => {
    const navigation = useNavigation();
    const loaderData = useLoaderData() as GroupLoaderData;
    const groups: Group[] = loaderData?.data.groups;
    const groupsMetadata = loaderData?.data.meta;
    const fetcher = useFetcher({ key: "groups" });
    const isLoading = navigation.state === "loading";
    const [searchParams] = useSearchParams();
    const currentSearch = searchParams.get("search") || "";
    const filteringByYourGroups = searchParams.has("your-groups");
    const filteringByJoinedGroups = searchParams.has("joined");

    const inputErrorsExist = fetcher.data && !fetcher.data?.success;

    return <main className={styles.groups}>
        <CurrentPageHeader
            altClassName={styles.header}
            icon="groups_3"
            text="Groups"
        >
            <div className={styles.buttons}>
                <CreateGroupButton />
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
                usersAmout={`(${groupsMetadata.count} ${groups.length !== 1 ? "groups" : "group"})`}
                placeholder="Programming"
            />
        </CurrentPageHeader>
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
