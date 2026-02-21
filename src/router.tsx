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
import Friends from "./pages/friends/Friends";
import About from "./pages/about/About";

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
import friendsLoader from "./pages/friends/friendsLoader";
import dashboardLoader from "./pages/dashboard/dashboardLoader";

// Component Loaders
import AppLoader from "./pages/app/app-loader/AppLoader";

// Actions
import registerAction from "./pages/register/registerAction";
import loginAction from "./pages/login/loginAction";
import settingsAction from "./pages/profile/child-routes/settings/settingsAction";
import currentConversationAction from "./pages/conversations/child-routes/current-conversation/currentConversationAction";
import usersAction from "./pages/users/usersAction";
import groupsAction from "./pages/groups/groupsAction";
import friendsAction from "./pages/friends/friendsAction";
import userProfileAction from "./pages/users/user-profile/userProfileAction";
import dashboardAction from "./pages/dashboard/dashboardAction";

// Components
import CurrentConversation from "./pages/conversations/child-routes/current-conversation/CurrentConversation";
import RedirectIfLogged from "./components/redirects/RedirectIfLogged";
import RedirectIfNotLogged from "./components/redirects/RedirectIfNotLogged";

// Error pages
import NotFoundPage from "./pages/not-found-page/NotFoundPage";
import ServerErrorPage from "./pages/server-error-page/ServerErrorPage";
import Dashboard from "./pages/dashboard/Dashboard";

const router = createBrowserRouter([
    {
        id: "root",
        path: "/",
        Component: App,
        loader: appLoader,
        hydrateFallbackElement: <AppLoader />,
        children: [
            {
                index: true,
                element: <RedirectIfLogged>
                    <Home />
                </RedirectIfLogged>,
            },
            {
                id: "dashboard",
                path: "/dashboard",
                element: <RedirectIfNotLogged>
                    <Dashboard />
                </RedirectIfNotLogged>,
                loader: dashboardLoader,
                action: dashboardAction
            },
            {
                path: "/register",
                element: <RedirectIfLogged>
                    <Register />
                </RedirectIfLogged>,
                action: registerAction,
                errorElement: <ServerErrorPage />
            },
            {
                path: "/login",
                element: <RedirectIfLogged>
                    <Login />
                </RedirectIfLogged>,
                action: loginAction,
                errorElement: <ServerErrorPage />,
            },
            {
                path: "/users",
                element: <RedirectIfNotLogged>
                    <Users />
                </RedirectIfNotLogged>,
                loader: usersLoader,
                action: usersAction,
                errorElement: <ServerErrorPage />
            },
            {
                path: "/users/:id",
                element: <RedirectIfNotLogged>
                    <UserProfile />
                </RedirectIfNotLogged>,
                loader: userProfileLoader,
                action: userProfileAction,
                errorElement: <ServerErrorPage />
            },
            {
                path: "/conversations",
                element: <RedirectIfNotLogged>
                    <Conversations />
                </RedirectIfNotLogged>,
                loader: conversationsLoader,
                errorElement: <ServerErrorPage />,
                children: [
                    {
                        index: true,
                        Component: NoConversationSelected
                    },
                    {
                        id: "current-conversation",
                        path: ":conversationId",
                        Component: CurrentConversation, // FIX: When CurrentConversation receivess invalid data and then you change back to a valid converastion, the route crashes.
                        loader: currentConversationLoader,
                        action: currentConversationAction,
                        errorElement: <ServerErrorPage />,
                    }
                ]
            },
            {
                path: "/groups",
                element: <RedirectIfNotLogged>
                    <Groups />
                </RedirectIfNotLogged>,
                loader: groupsLoader,
                action: groupsAction,
                errorElement: <ServerErrorPage />,
            },
            {
                path: "/profile",
                element: <RedirectIfNotLogged>
                    <Profile />
                </RedirectIfNotLogged>,
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
            {
                path: "/friends",
                element: <RedirectIfNotLogged>
                    <Friends />
                </RedirectIfNotLogged>,
                loader: friendsLoader,
                action: friendsAction,
                errorElement: <ServerErrorPage />,
            },
            {
                path: "/about",
                Component: About
            },
            {
                path: "*",
                Component: NotFoundPage,
            },
        ],
    },
    {
        path: "/logout",
        Component: Logout,
        loader: logoutLoader
    },
]);

export default router;
