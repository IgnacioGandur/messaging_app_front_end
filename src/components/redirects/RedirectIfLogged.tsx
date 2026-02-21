import {
    useRouteLoaderData,
    Navigate
} from "react-router";
import type RootLoaderDataProps from "../../types/rootLoaderData";

const RedirectIfLogged = ({ children }: React.PropsWithChildren<{}>) => {
    const loaderData = useRouteLoaderData("root") as RootLoaderDataProps;
    const isLogged = loaderData.success;

    if (isLogged) {
        return <Navigate to="/dashboard" />
    } else {
        return <>
            {children}
        </>
    }
}
export default RedirectIfLogged;
