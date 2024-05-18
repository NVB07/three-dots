import Chat from "@/components/layout/pages/chat/Chat";
import ListRoomChat from "@/components/layout/pages/chat/ListRoomChat";

// import { getDocs, collection } from "firebase/firestore";
// import { fireStore } from "@/firebase/config";
// export async function generateMetadata({ params }) {
//     try {
//         const querySnapshot = await getDocs(collection(fireStore, "roomsChat"));
//         const userDataArray = [];

//         querySnapshot.forEach((doc) => {
//             userDataArray.push({ id: doc.id, data: doc.data() });
//         });

//         const objUser = userDataArray.find((item) => {
//             if ("%40" + item.data.uid === params.user) {
//                 return 1;
//             }
//         });
//         return { title: objUser.data.displayName };
//     } catch (error) {
//         console.error("Error fetching user data:", error);
//     }
// }

export default function RootLayout({ children }) {
    return (
        <>
            <Chat>{children}</Chat>
        </>
    );
}
