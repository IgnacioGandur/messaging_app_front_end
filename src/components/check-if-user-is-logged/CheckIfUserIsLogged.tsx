import { useEffect, type ReactNode } from "react";
import { useRouteLoaderData, useNavigate, useLocation } from "react-router";

type CheckIfUserIsLoggedProps = {
    children: ReactNode;
}
const CheckIfUserIsLogged = ({
    children
}: CheckIfUserIsLoggedProps) => {
    const rootData = useRouteLoaderData("root");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!rootData?.success) {
            navigate("/login?message=" + encodeURIComponent(`You need to be logged to accesss the route: '${location.pathname}'.`));
        }
    }, [rootData]);

    if (rootData?.success) {
        return children;
    }
}

export default CheckIfUserIsLogged;

