const friendshipRequestsLoader = async () => {
    const url = import.meta.env.VITE_API_BASE + "/friendships?filter=PENDING";
    const options: RequestInit = {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    };

    const response = await fetch(url, options);
    return await response.json();
};

export default friendshipRequestsLoader;
