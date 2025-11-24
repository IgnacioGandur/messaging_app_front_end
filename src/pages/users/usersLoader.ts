export default async function usersLoader() {
    try {
        const usersUrl = import.meta.env.VITE_API_BASE + "/users";
        const friendshipsUrl = import.meta.env.VITE_API_BASE + "/friendships";
        const options: RequestInit = {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        };

        const usersResponse = await fetch(usersUrl, options);
        const friendshipsResponse = await fetch(friendshipsUrl, options);

        const usersResult = await usersResponse.json();
        const friendshipsResult = await friendshipsResponse.json();

        return {
            users: usersResult?.users,
            friendships: friendshipsResult?.friendships
        };
    } catch (error) {
        return {
            error: true,
            message: "Server error. We were not able to load the users."
        }
    }
}
