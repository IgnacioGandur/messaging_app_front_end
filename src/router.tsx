import { createBrowserRouter, Navigate } from "react-router";

// Pages
import Home from "./pages/home/Home";
import App from "./pages/app/App";
import Register from "./pages/register/Register";
import Logout from "./pages/logout/Logout";
import Login from "./pages/login/Login";
import Users from "./pages/users/Users";
import Profile from "./pages/profile/Profile";

// Child Routes
import Settings from "./pages/profile/child-routes/settings/Settings";

// Loaders
import appLoader from "./pages/app/appLoader";
import logoutLoader from "./pages/logout/logoutLoader";
import usersLoader from "./pages/users/usersLoader";

// Actions
import registerAction from "./pages/register/registerAction";
import loginAction from "./pages/login/loginAction";

// Components
import CheckIfUserIsLogged from "./components/check-if-user-is-logged/CheckIfUserIsLogged";
import settingsAction from "./pages/profile/child-routes/settings/settingsAction";

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
                loader: usersLoader
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
