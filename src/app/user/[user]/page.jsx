import Footer from "@/components/footer/Footer";
import User from "@/components/pages/user/User";

const Page = ({ params }) => {
    return (
        <>
            <main>
                <div className="pt-24 w-full flex justify-center">
                    <div className="w-full max-w-[620px]">
                        <User param={params.user} />
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Page;
