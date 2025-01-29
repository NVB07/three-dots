import { useSearchParams } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import Cookies from "js-cookie";
import { addUser } from "@/firebase/services";

const useAuth = () => {
    const searchParams = useSearchParams();

    const updateAuthCookie = (token, day) => {
        Cookies.set("token", token, {
            expires: day,
            secure: process.env.NODE_ENV === "production", // Chỉ gửi cookie qua HTTPS
            sameSite: "Strict", // Ngăn chặn CSRF
        });
    };

    const loginWithGoogle = async () => {
        const next = searchParams.get("next"); // Lấy giá trị của tham số `next` từ URL
        try {
            const googleProvider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const token = await user.getIdToken();

            // Kiểm tra nếu là người dùng mới
            if (result._tokenResponse?.isNewUser) {
                await addUser("users", user.uid, {
                    displayName: user.displayName || "",
                    email: user.email || "",
                    threads: "",
                    facebook: "",
                    instagram: "",
                    tiktok: "",
                    x: "",
                    photoURL: user.photoURL || "",
                    uid: user.uid,
                    providerId: result._tokenResponse.providerId,
                });
            }

            // Lưu token vào cookie
            updateAuthCookie(token, 3);
            window.location.href = next || "/";
        } catch (error) {
            console.error("Error logging in with Google:", error);
        }
    };

    const loginWithGithub = async () => {
        const next = searchParams.get("next");
        try {
            const githubProvider = new GithubAuthProvider();
            const result = await signInWithPopup(auth, githubProvider);
            const user = result.user;
            const token = await user.getIdToken();

            // Kiểm tra nếu là người dùng mới
            if (result._tokenResponse?.isNewUser) {
                await addUser("users", user.uid, {
                    displayName: user.displayName || "",
                    email: user.email || "",
                    threads: "",
                    facebook: "",
                    instagram: "",
                    tiktok: "",
                    x: "",
                    photoURL: user.photoURL || "",
                    uid: user.uid,
                    providerId: result._tokenResponse.providerId,
                });
            }

            // Lưu token vào cookie
            updateAuthCookie(token, 3);
            window.location.href = next || "/";
        } catch (error) {
            console.error("Error logging in with GitHub:", error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            // Xóa token khỏi cookie
            Cookies.remove("token");

            // window.location.href = "/login";
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return { loginWithGoogle, loginWithGithub, logout, updateAuthCookie };
};

export default useAuth;
