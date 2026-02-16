import type { LoaderFunctionArgs } from "react-router";
import apiRequestLoader from "../../utils/apiRequestLoader";

export default async function groupsLoader({ request }: LoaderFunctionArgs) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const url = new URL(request.url);
    const page = url.searchParams.get("page") || 1;
    const search = url.searchParams.get("search") || "";
    const yourGroups = url.searchParams.has("your-groups");
    const joined = url.searchParams.has("joined");

    const groupsUrl = new URL(`${import.meta.env.VITE_API_BASE}/groups`);

    groupsUrl.searchParams.set("page", String(page));
    if (search) groupsUrl.searchParams.set("search", search);
    if (yourGroups) groupsUrl.searchParams.set("yourGroups", "true");
    if (joined) groupsUrl.searchParams.set("joined", "true");

    const options: RequestInit = {
        method: "GET",
    };

    return await apiRequestLoader(groupsUrl.href, options);
}
