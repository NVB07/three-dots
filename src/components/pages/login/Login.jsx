"use client";
import { toast, Toaster } from "sonner";
import GoogleIcon from "@/components/icons/GoogleIcon";
import Logo from "@/components/icons/Logo";
import GithubIcon from "@/components/icons/GithubIcon";
import FacebookIcon from "@/components/icons/FacebookIcon";
import useAuth from "@/customHook/useAuth";

const Login = () => {
    const { loginWithGoogle, loginWithGithub } = useAuth();
    const handleFacebookSignUp = async () => {
        toast.info("chức năng đang được phát triển");
    };

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <Toaster position="top-center" richColors />
            <div className="W-full max-w-[500px] p-4 pb-6 flex flex-col items-center rounded-2xl ">
                <div className="flex flex-col items-center pb-7">
                    <Logo color="hsl(var(--foreground))" width="100" height="100" />
                    <h2 className="text-3xl font-semibold  text-center">
                        Đăng nhập vào <span className="text-[#0d9b00] text-4xl inline-block mt-3 font-bold text-nowrap">Three dots</span>
                    </h2>
                </div>

                <button
                    className="mb-2 relative w-full  hover:shadow hover:scale-105 transition-transform max-w-[300px] flex font-medium items-center justify-center border border-[#525252] border-solid rounded-full p-2"
                    onClick={loginWithGoogle}
                >
                    <GoogleIcon />
                    Đăng nhập bằng <b className="mx-1">Google</b>
                </button>
                <button
                    className="mb-2 relative  hover:shadow hover:scale-105 transition-transform w-full max-w-[300px] flex font-medium items-center justify-center border border-[#525252] border-solid rounded-full p-2"
                    onClick={loginWithGithub}
                >
                    <GithubIcon />
                    Đăng nhập bằng <b className="mx-1">Github</b>
                </button>
                <button
                    className="mb-2 relative  hover:shadow hover:scale-105 transition-transform w-full max-w-[300px] flex font-medium items-center justify-center border border-[#525252] border-solid rounded-full p-2"
                    onClick={handleFacebookSignUp}
                >
                    <FacebookIcon style="absolute top1/2 left-2" />
                    Đăng nhập bằng <b className="mx-1">Facebook</b>
                </button>

                <p className="text-xs w-full max-w-[300px] italic text-center mt-4">Your continued use of this website means you agree to use my services.</p>
            </div>
        </div>
    );
};

export default Login;
