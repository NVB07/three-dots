import { getDocument } from "@/firebase/services";
export async function generateMetadata({ params }) {
    try {
        const docSnap = await getDocument("users", params.user.replace("%40", ""), true);

        if (docSnap.exists()) {
            return { title: docSnap.data().displayName };
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}
export default function UserLayout({ children }) {
    return <>{children}</>;
}
