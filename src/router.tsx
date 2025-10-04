import { createBrowserRouter } from "react-router";

// Pages
import Home from "./pages/home/Home";
import App from "./pages/app/App";

// Loaders
import appLoader from "./pages/app/appLoader";

const router = createBrowserRouter([
    {
        id: "root",
        path: "/",
        Component: App,
        loader: appLoader,
        children: [
            {
                index: true,
                Component: Home,
            },
        ],
    },
]);

export default router;
