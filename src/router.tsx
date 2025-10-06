import { createBrowserRouter } from "react-router";

// Pages
import Home from "./pages/home/Home";
import App from "./pages/app/App";
import Register from "./pages/register/Register";
import Logout from "./pages/logout/Logout";
import Login from "./pages/login/Login";

// Loaders
import appLoader from "./pages/app/appLoader";
import logoutLoader from "./pages/logout/logoutLoader";

// Actions
import registerAction from "./pages/register/registerAction";
import loginAction from "./pages/login/loginAction";

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
            }
        ],
    },
    {
        path: "/logout",
        Component: Logout,
        loader: logoutLoader
    }
]);

export default router;
