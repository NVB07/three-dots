import { getDocument } from "@/firebase/services";

export async function generateMetadata({ params }) {
    try {
        return { title: "Tin nhắn mới" };
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}
export default function ChatFriend({ children }) {
    return <>{children}</>;
}
