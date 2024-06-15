import { getUser } from "@/firebase/services";
export async function generateMetadata({ params }) {
    try {
        const UserData = await getUser(params.user.replace("%40", ""), { cache: "no-store" });

        return { title: UserData.displayName };
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}
export default function UserLayout({ children }) {
    return <>{children}</>;
}
