"use client";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import GoogleIcon from "@/components/icons/GoogleIcon";
import Logo from "@/components/icons/Logo";
import GithubIcon from "@/components/icons/GithubIcon";
import FacebookIcon from "@/components/icons/FacebookIcon";
import useAuth from "@/customHook/useAuth";

const Login = () => {
    const { loginWithGoogle, loginWithGithub, sigUpEmail } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleSignup = async () => {
        sigUpEmail(email, password);
    };
    return (
        <div className="w-full h-screen flex items-center justify-center">
            <Toaster position="top-center" richColors />
            <div className="W-full max-w-[500px] p-4 pb-6 flex flex-col items-center rounded-2xl ">
                <div className="flex flex-col items-center pb-7">
                    <Logo color="hsl(var(--foreground))" width="100" height="100" />
                    <h2 className="text-3xl font-semibold  text-center">
                        Đăng nhập <span className="text-[#0d9b00] text-4xl inline-block mt-3 font-bold text-nowrap">Three dots</span>
                    </h2>
                </div>
                <div className="flex flex-col w-full items-center">
                    <input
                        placeholder="Email"
                        type="email"
                        className="mb-2 relative w-full   max-w-[300px] flex  items-center justify-center border border-[#a9a9a9] border-solid rounded-full p-2 px-3"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        placeholder="Password"
                        type="password"
                        className="mb-2 relative w-full   max-w-[300px] flex  items-center justify-center border border-[#a9a9a9] border-solid rounded-full p-2 px-3"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        onClick={handleSignup}
                        className="mb-2 relative w-full  hover:shadow hover:scale-105 transition-transform max-w-[300px] cursor-pointer flex font-medium items-center justify-center bg-[#ec520b] text-white rounded-full p-2"
                        disabled={!email || !password}
                    >
                        Đăng nhập
                    </button>
                </div>
                <div className="w-[300px] my-2 border-b border-[#ccc]"> </div>
                <div className="flex mt-2">
                    <button
                        className="mx-1 relative w-full  hover:shadow hover:scale-105 transition-transform max-w-[300px] flex font-medium items-center justify-center border border-[#919191] border-solid rounded-full p-2"
                        onClick={loginWithGoogle}
                    >
                        <GoogleIcon />
                    </button>
                    <button
                        className="mx-1 relative  hover:shadow hover:scale-105 transition-transform w-full max-w-[300px] flex font-medium items-center justify-center border border-[#919191] border-solid rounded-full p-2"
                        onClick={loginWithGithub}
                    >
                        <GithubIcon />
                    </button>
                </div>
                {/* <button
                    className="mb-2 relative  hover:shadow hover:scale-105 transition-transform w-full max-w-[300px] flex font-medium items-center justify-center border border-[#525252] border-solid rounded-full p-2"
                    onClick={handleFacebookSignUp}
                >
                    <FacebookIcon style="absolute top1/2 left-2" />
                    Đăng nhập bằng <b className="mx-1">Facebook</b>
                </button> */}
                <p className="text-sm w-full max-w-[300px] italic text-center mt-4">
                    Chưa có tài khoản? <button className="italic text-[#ec520b] hover:underline">Đăng kí ngay</button>
                </p>
            </div>
        </div>
    );
};

export default Login;
