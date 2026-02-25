const floatingConversationsLoader = async () => {
    const url = `${import.meta.env.VITE_API_BASE}/conversations?take=5`;
    const options: RequestInit = {
        method: "GET",
        credentials: "include",
    };
    const response = await fetch(url, options);
    return await response.json();
};

export default floatingConversationsLoader;
