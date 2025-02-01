"use client";
import { useState, useRef } from "react";
import { toast, Toaster } from "sonner";
import GoogleIcon from "@/components/icons/GoogleIcon";
import Logo from "@/components/icons/Logo";
import GithubIcon from "@/components/icons/GithubIcon";
import Image from "next/image";
import useAuth from "@/customHook/useAuth";
import Eye from "@/components/icons/Eye";
import CloseEye from "@/components/icons/CloseEye";
import LoadingIcon from "@/components/icons/LoadingIcon";

const Login = () => {
    const { loginWithGoogle, loginWithGithub, sigUpEmail, signinEmail } = useAuth();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const [registerForm, setRegisterForm] = useState(false);
    const [email, setEmail] = useState("");
    const [email2, setEmail2] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [name, setName] = useState("");
    const [inputType, setInputType] = useState("password");
    const [inputType2, setInputType2] = useState("password");
    const passwordRef = useRef(null);
    const passwordRef2 = useRef(null);
    const [loading1, setLoading1] = useState(false);

    const handleToggleRegisterForm = () => {
        setRegisterForm((pre) => !pre);
        setEmail("");
        setPassword("");
    };
    const handleShowPassword = () => {
        setInputType((pre) => (pre === "text" ? "password" : "text"));
        setTimeout(() => {
            passwordRef.current.focus(); // Focus lại input
            const length = passwordRef.current.value.length; // Lấy độ dài giá trị
            passwordRef.current.setSelectionRange(length, length); // Đưa con trỏ về cuối
        }, 0);
    };
    const handleShowPassword2 = () => {
        setInputType2((pre) => (pre === "text" ? "password" : "text"));
        setTimeout(() => {
            passwordRef2.current.focus(); // Focus lại input
            const length = passwordRef2.current.value.length; // Lấy độ dài giá trị
            passwordRef2.current.setSelectionRange(length, length); // Đưa con trỏ về cuối
        }, 0);
    };

    const handleSignin = async () => {
        if (!email || !password) {
            return toast.error("Vui lòng nhập đầy đủ thông tin");
        }
        if (!emailRegex.test(email)) {
            return toast.error("Email không hợp lệ");
        }

        setLoading1(true);
        await signinEmail(email, password);
        setLoading1(false);
    };
    const handleSignup = async () => {
        if (!email2 || !password2 || !rePassword || !name) {
            return toast.error("Vui lòng nhập đầy đủ thông tin");
        }
        if (password2 !== rePassword) {
            return toast.error("Mật khẩu không trùng khớp");
        }
        if (!emailRegex.test(email2)) {
            return toast.error("Email không hợp lệ");
        }
        setLoading1(true);
        const user = await sigUpEmail(email2, password2, name);
        if (user) {
            toast.success("Đăng kí thành công");
            setEmail(email2);
            setEmail2("");
            setPassword2("");
            setRePassword("");
            setName("");
            setRegisterForm(false);
        } else {
            toast.error("Đăng kí thất bại");
        }

        setLoading1(false);
    };
    return (
        <div className="w-full h-screen flex items-center ">
            <Toaster position="top-center" richColors />
            <div className="md:w-1/2 md:block hidden h-screen">
                <img className="w-full h-screen object-cover" src="/wlop.jpg" alt="anh login" />
            </div>
            <div className="md:w-1/2 w-full  h-fit bg-white p-4 pb-6 flex flex-col items-center justify-center rounded-2xl ">
                <div className="flex flex-col items-center pb-7">
                    <Logo color="hsl(var(--foreground))" width="100" height="100" />
                    <h2 className="text-3xl font-semibold  text-center">
                        {!registerForm ? " Đăng nhập" : "Đăng kí"} <span className="text-[#0d9b00] text-4xl inline-block mt-3 font-bold text-nowrap">Three dots</span>
                    </h2>
                </div>
                {registerForm ? (
                    <div className="flex flex-col w-full items-center">
                        <input
                            placeholder="Email"
                            type="email"
                            className="mb-2 relative w-full   max-w-[300px] flex  items-center justify-center border border-[#a9a9a9] border-solid rounded-full p-2 px-3"
                            onChange={(e) => setEmail2(e.target.value)}
                            value={email2}
                        />
                        <div className="mb-2 relative w-full focus-within:outline-black focus-within:outline-2 outline-[#a9a9a9] outline outline-1 max-w-[300px] flex  items-center justify-center  rounded-full p-2 px-3 ">
                            <input
                                ref={passwordRef2}
                                placeholder="Mật khẩu"
                                value={password2}
                                type={inputType2}
                                className="w-[95%] border-none outline-none pr-2"
                                onChange={(e) => setPassword2(e.target.value)}
                            />
                            <button onClick={handleShowPassword2} className="w-[5%] flex justify-center items-center">
                                {inputType2 !== "password" ? <Eye /> : <CloseEye />}
                            </button>
                        </div>
                        <input
                            // ref={passwordRef}
                            placeholder="Xác nhận mật khẩu"
                            type={inputType2}
                            value={rePassword}
                            className="mb-2 relative w-full   max-w-[300px] flex  items-center justify-center border border-[#a9a9a9] border-solid rounded-full p-2 px-3"
                            onChange={(e) => setRePassword(e.target.value)}
                        />
                        <input
                            placeholder="Tên"
                            type="text"
                            value={name}
                            className="mb-2 relative w-full   max-w-[300px] flex  items-center justify-center border border-[#a9a9a9] border-solid rounded-full p-2 px-3"
                            onChange={(e) => setName(e.target.value)}
                        />

                        <button
                            onClick={handleSignup}
                            className="mb-2 relative w-full  hover:shadow hover:scale-105 transition-transform max-w-[300px] cursor-pointer flex font-medium items-center justify-center bg-[#ec520b] text-white rounded-full p-2"
                            disabled={loading1}
                        >
                            {loading1 ? <LoadingIcon /> : "Đăng kí"}
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col w-full items-center">
                        <input
                            placeholder="Email"
                            type="email"
                            className="mb-2 relative w-full   max-w-[300px] flex  items-center justify-center border border-[#a9a9a9] border-solid rounded-full p-2 px-3"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                        <div className="mb-1 relative w-full focus-within:outline-black focus-within:outline-2 outline-[#a9a9a9] outline outline-1 max-w-[300px] flex  items-center justify-center  rounded-full p-2 px-3 ">
                            <input
                                ref={passwordRef}
                                placeholder="Password"
                                type={inputType}
                                className="w-[95%] border-none outline-none pr-2"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                            <button onClick={handleShowPassword} className="w-[5%] flex justify-center items-center">
                                {inputType !== "password" ? <Eye /> : <CloseEye />}
                            </button>
                        </div>
                        <div className="w-full max-w-[300px] flex justify-end items-center mb-3">
                            <button className="text-[#ec520b] text-xs hover:underline">Quên mật khẩu?</button>
                        </div>
                        <button
                            onClick={handleSignin}
                            className="mb-2 relative w-full  hover:shadow hover:scale-105 transition-transform max-w-[300px] cursor-pointer flex font-medium items-center justify-center bg-[#ec520b] text-white rounded-full p-2"
                            disabled={loading1}
                        >
                            {loading1 ? <LoadingIcon /> : "Đăng nhập"}
                        </button>
                    </div>
                )}

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
                <p className="text-sm w-full max-w-[300px]  text-center mt-4">
                    {!registerForm ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
                    <button onClick={handleToggleRegisterForm} className=" text-[#ec520b] hover:underline">
                        {!registerForm ? "Đăng kí ngay" : " Đăng nhập"}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
