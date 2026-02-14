import styles from "./Conversations.module.css";

// Types
import type Conversation from "../../types/conversation";

// Packages
import { Fragment } from "react";
import {
    useLoaderData,
    Outlet,
    useSearchParams,
    useRouteLoaderData,
} from "react-router";

// Components
import Filtering from "../../components/filtering/Filtering";
import SingleConversation from "./single-conversation/SingleConversation";
import CurrentPageHeader from "../../components/current-page-header/CurrentPageHeader";
import SearchForm from "../../components/search-form/SearchForm";

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
            <section className={styles["chats-sidebar"]}>
                {conversations && conversations.length === 0 ? (
                    <div className={styles["no-conversations"]}>
                        <span
                            className={`material-symbols-rounded ${styles.icon}`}
                        >
                            chat_dashed
                        </span>
                        <p
                            className={styles.text}
                        >
                            You don't have any conversations yet...
                        </p>
                    </div>
                ) : (
                    conversations.map((conversation) => {
                        return <Fragment
                            key={conversation.id}
                        >
                            <SingleConversation
                                conversation={conversation}
                                loggedUserId={loggedUser.id}
                            />
                            <div className={styles.separator}></div>
                        </Fragment>
                    })
                )}
            </section>
            <Outlet />
        </div>
    </main >
}

export default Conversations;
