"use client";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useContext } from "react";
import { auth } from "@/firebase/config";
import { addUser } from "@/firebase/services";

import { AuthContext } from "@/auth/AuthProvider";
import GoogleIcon from "@/components/icons/GoogleIcon";
import Logo from "@/components/icons/Logo";
import GithubIcon from "@/components/icons/GithubIcon";
import FacebookIcon from "@/components/icons/FacebookIcon";

const Login = () => {
    const data = useContext(AuthContext);

    const handleGoogleSignUp = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);
            // Thực hiện các hành động sau khi đăng ký bằng Google thành công, ví dụ: chuyển hướng, hiển thị thông báo thành công, vv.
            if (userCredential._tokenResponse?.isNewUser) {
                await addUser("users", userCredential.user.uid, {
                    displayName: userCredential.user.displayName,
                    email: userCredential.user.email,
                    photoURL: userCredential.user.photoURL,
                    uid: userCredential.user.uid,
                    providerId: userCredential.user.providerId,
                });
            }
        } catch (error) {
            // Xử lý lỗi đăng ký bằng Google, ví dụ: hiển thị thông báo lỗi, đặt state lỗi, vv.
            console.error("Lỗi đăng ký bằng Google", error);
        }
    };
    const handleGithubSignUp = async () => {
        alert("chức năng đang được phát triển");
    };

    const handleFacebookSignUp = async () => {
        alert("chức năng đang được phát triển");
    };
    return (
        <div className="w-full h-screen flex items-center justify-center">
            <div className="W-full max-w-[500px] p-4 pb-6 flex flex-col items-center rounded-2xl ">
                <div className="flex flex-col items-center pb-7">
                    <Logo color="hsl(var(--foreground))" width="100" height="100" />
                    <h2 className="text-3xl font-semibold  text-center">
                        Đăng nhập vào <span className="text-[#0d9b00] text-4xl inline-block mt-3 font-bold text-nowrap">Three dots</span>
                    </h2>
                </div>

                <button
                    className="mb-2 relative w-full  hover:shadow hover:scale-105 transition-transform max-w-[300px] flex font-medium items-center justify-center border border-[#525252] border-solid rounded-full p-2"
                    onClick={handleGoogleSignUp}
                >
                    <GoogleIcon />
                    Đăng nhập bằng <b className="mx-1">Google</b>
                </button>
                <button
                    className="mb-2 relative  hover:shadow hover:scale-105 transition-transform w-full max-w-[300px] flex font-medium items-center justify-center border border-[#525252] border-solid rounded-full p-2"
                    onClick={handleGithubSignUp}
                >
                    <GithubIcon />
                    Đăng nhập bằng <b className="mx-1">Github</b>
                </button>
                <button
                    className="mb-2 relative  hover:shadow hover:scale-105 transition-transform w-full max-w-[300px] flex font-medium items-center justify-center border border-[#525252] border-solid rounded-full p-2"
                    onClick={handleFacebookSignUp}
                >
                    <FacebookIcon />
                    Đăng nhập bằng <b className="mx-1">Facebook</b>
                </button>
                {/* <div className="w-28">
                    <ToggleTheme />
                </div> */}
                <p className="text-xs w-full max-w-[300px] italic text-center mt-4">Your continued use of this website means you agree to use my services.</p>
            </div>
        </div>
    );
};

export default Login;
