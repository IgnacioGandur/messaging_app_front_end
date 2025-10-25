import { createBrowserRouter, Navigate } from "react-router";

// Pages
import Home from "./pages/home/Home";
import App from "./pages/app/App";
import Register from "./pages/register/Register";
import Logout from "./pages/logout/Logout";
import Login from "./pages/login/Login";
import Users from "./pages/users/Users";
import Profile from "./pages/profile/Profile";
import UserProfile from "./pages/users/user-profile/UserProfile";
import Conversations from "./pages/conversations/Conversations";
import NoConversationSelected from "./pages/conversations/child-routes/no-conversation-selected/NoConversationSelected";
import Groups from "./pages/groups/Groups";

// Child Routes
import Settings from "./pages/profile/child-routes/settings/Settings";

// Loaders
import appLoader from "./pages/app/appLoader";
import logoutLoader from "./pages/logout/logoutLoader";
import usersLoader from "./pages/users/usersLoader";
import userProfileLoader from "./pages/users/user-profile/userProfileLoader";
import conversationsLoader from "./pages/conversations/conversationsLoader";
import currentConversationLoader from "./pages/conversations/child-routes/current-conversation/currentConversationLoader";
import groupsLoader from "./pages/groups/groupsLoader";

// Actions
import registerAction from "./pages/register/registerAction";
import loginAction from "./pages/login/loginAction";
import settingsAction from "./pages/profile/child-routes/settings/settingsAction";
import currentConversationAction from "./pages/conversations/child-routes/current-conversation/currentConversationAction";
import usersAction from "./pages/users/usersAction";
import groupsAction from "./pages/groups/groupsAction";

// Components
import CheckIfUserIsLogged from "./components/check-if-user-is-logged/CheckIfUserIsLogged";
import CurrentConversation from "./pages/conversations/child-routes/current-conversation/CurrentConversation";

const router = createBrowserRouter([
    {
        id: "root",
        path: "/",
        Component: App,
        loader: appLoader,
        hydrateFallbackElement: <p>loading...</p>,
        children: [
            {
                index: true,
                Component: Home,
            },
            {
                path: "/register",
                Component: Register,
                action: registerAction
            },
            {
                path: "/login",
                Component: Login,
                action: loginAction,
            },
            {
                path: "/users",
                Component: Users,
                loader: usersLoader,
                action: usersAction,
            },
            {
                path: "/users/:id",
                Component: UserProfile,
                loader: userProfileLoader
            },
            {
                path: "/conversations",
                Component: Conversations,
                loader: conversationsLoader,
                children: [
                    {
                        index: true,
                        Component: NoConversationSelected
                    },
                    {
                        path: ":conversationId",
                        Component: CurrentConversation,
                        loader: currentConversationLoader,
                        action: currentConversationAction
                    }
                ]
            },
            {
                path: "/groups",
                Component: Groups,
                loader: groupsLoader,
                action: groupsAction,
            },
            {
                path: "/profile",
                element: <CheckIfUserIsLogged>
                    <Profile />
                </CheckIfUserIsLogged>,
                children: [
                    {
                        index: true,
                        element: <Navigate to="settings" replace />
                    },
                    {
                        path: "settings",
                        Component: Settings,
                        action: settingsAction
                    }
                ]
            },
        ],
    },
    {
        path: "/logout",
        Component: Logout,
        loader: logoutLoader
    }
]);

export default router;
