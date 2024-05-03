import User from "@/components/layout/pages/user/User";
// import Header from "@/components/header/Header";
import { getDocs, collection } from "firebase/firestore";
import { fireStore } from "@/firebase/config";
export async function generateMetadata({ params }) {
    try {
        const querySnapshot = await getDocs(collection(fireStore, "users"));
        const userDataArray = [];

        querySnapshot.forEach((doc) => {
            userDataArray.push({ id: doc.id, data: doc.data() });
        });

        const objUser = userDataArray.find((item) => {
            if ("%40" + item.data.uid === params.user) {
                return 1;
            }
        });
        return { title: objUser.data.displayName };
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}
const Page = ({ params }) => {
    return (
        <>
            <div className="pt-24 w-full flex justify-center">
                <div className="w-full max-w-[620px]">
                    <User param={params.user} />
                    <p>path: {params.user}</p>
                </div>
            </div>
        </>
    );
};

export default Page;
