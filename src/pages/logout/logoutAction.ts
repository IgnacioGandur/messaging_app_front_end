import { redirect } from "react-router";

const logoutACtion = async () => {
    const url = `${import.meta.env.VITE_API_BASE}/auth/logout`;
    const options: RequestInit = {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    };

    await fetch(url, options);

    return redirect("/login");
}

export default logoutACtion;
