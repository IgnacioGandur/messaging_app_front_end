import {
    useRouteLoaderData,
    Navigate,
    useLocation
} from "react-router";

import type RootLoaderDataProps from "../../types/rootLoaderData";

const RedirectIfNotLogged = ({
    children
}: React.PropsWithChildren<{}>) => {
    const location = useLocation();
    const loaderData = useRouteLoaderData("root") as RootLoaderDataProps;
    const isLogged = loaderData.success;
    const message = encodeURIComponent(`You must be logged to access this route. Trying to access: "${location.pathname}".`);

    if (isLogged) {
        return <>
            {children}
        </>
    } else {
        return <Navigate to={`/login?message= + ${message}`} />
    }
}
export default RedirectIfNotLogged;
