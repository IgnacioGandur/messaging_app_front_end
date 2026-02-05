import { useEffect } from "react";
import { useLocation, useNavigation } from "react-router";

const ManagePageTitles = () => {
    const location = useLocation();
    const navigation = useNavigation();
    const isLoading = navigation.state === "loading";

    useEffect(() => {
        const routes: Record<string, string> = {
            "/": "Homepage",
            "/users": "Users List",
            "/conversations": "Your Conversations",
            "/friends": "Your Friends",
            "/groups": "Groups List",
            "/about": "About This Page",
            "/register": "Create an account to and meet new Friends!",
            "/login": "Login ",
        };

        if (!routes[location.pathname]) {
            return;
        }

        const pageTitle = routes[location.pathname];

        document.title = isLoading ? "Loading..." : `${pageTitle} | Chateá!`;

    }, [location, isLoading]);

    return null;
}

export default ManagePageTitles;
