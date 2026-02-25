import apiRequestLoader from "../../utils/apiRequestLoader.ts";

const floatingConversationsLoader = async () => {
    const url = `${import.meta.env.VITE_API_BASE}/conversations?take=5`;
    return await apiRequestLoader(url);
};

export default floatingConversationsLoader;
