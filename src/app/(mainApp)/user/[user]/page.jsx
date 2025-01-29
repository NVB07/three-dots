"use client";
import Footer from "@/components/footer/Footer";
import User from "@/components/pages/user/User";
import { getDocument } from "@/firebase/services";
const Page = ({ params }) => {
    const getdata = async () => {
        const docSnap = await getDocument("users", params.user.replace("%40", ""), true);
        console.log(params.user.replace("%40", ""));

        if (docSnap.exists()) {
            console.log(docSnap.data());

            // return { title: docSnap.data().displayName };
        }
    };
    return (
        <>
            <main>
                <div className="pt-6 w-full flex justify-center">
                    <div className="w-full max-w-[620px]">
                        <User param={params.user} />
                    </div>
                </div>
            </main>
            <button onClick={getdata}>aaaa</button>
            <Footer />
        </>
    );
};

export default Page;
