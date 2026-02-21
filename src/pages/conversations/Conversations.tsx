import styles from "./Conversations.module.css";

// Types
import type Conversation from "../../types/conversation";

// Packages
import {
    useLoaderData,
    Outlet,
    useSearchParams,
    useRouteLoaderData,
} from "react-router";

// Components
import Filtering from "../../components/filtering/Filtering";
import CurrentPageHeader from "../../components/current-page-header/CurrentPageHeader";
import SearchForm from "../../components/search-form/SearchForm";
import ChatsSidebar from "./chats-sidebar/ChatsSidebar";

const Conversations = () => {
    const rootData = useRouteLoaderData("root");
    const loggedUser = rootData?.user;
    const loaderData = useLoaderData() as {
        success: boolean;
        error?: boolean;
        message: string;
        data: {
            conversations: Conversation[];
            count: number;
        }
    };
    const conversations: Conversation[] = loaderData?.data.conversations;
    const conversationsCount = loaderData?.data.count;
    const [searchParams] = useSearchParams();
    const currentSearch = searchParams.get("search") || "";
    const isFilteringBySearch = searchParams.has("search");

    return <main className={styles.conversations}>
        <CurrentPageHeader
            icon="conversation"
            text="Conversations"
        >
            <SearchForm
                currentSearch={currentSearch}
                labelText="Search a conversation by username or by group title"
                usersAmout={`(${conversationsCount}) conversations`}
                placeholder="John"
            />
        </CurrentPageHeader>
        {isFilteringBySearch && (
            <Filtering
                currentSearch={currentSearch}
                filteringText="Filtering conversations by group title or username:"
                searchParams={searchParams}
                to="/conversations"
            />
        )}
        <div className={styles.wrapper}>
            <ChatsSidebar
                conversations={conversations}
                loggedUserId={loggedUser.id}
            />
            <Outlet />
        </div>
    </main >
}

export default Conversations;
