import { useSearchParams } from "next/navigation";
import {
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider,
    createUserWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase/config";
import Cookies from "js-cookie";
import { addUser } from "@/firebase/services";

const useAuth = () => {
    const searchParams = useSearchParams();

    const deleteCookie = (key) => {
        Cookies.remove(key);
    };
    const updateAuthCookie = (key, value, time) => {
        Cookies.set(key, value, {
            expires: time,
            secure: process.env.NODE_ENV === "production", // Chỉ gửi cookie qua HTTPS
            sameSite: "Strict", // Ngăn chặn CSRF
        });
    };

    const sigUpEmail = async (email, password, displayName) => {
        try {
            const account = await createUserWithEmailAndPassword(auth, email, password);
            const user = account.user;
            console.log(account);

            await sendEmailVerification(user);
            await addUser("users", user.uid, {
                displayName: displayName,
                email: email,
                threads: "",
                facebook: "",
                instagram: "",
                tiktok: "",
                x: "",
                photoURL: "",
                uid: user.uid,
                following: [],
            });

            return user;
        } catch (error) {
            console.error("Error signing up:", error);
            return false;
        }
    };
    const signinEmail = async (email, password) => {
        const next = searchParams.get("next"); // Lấy giá trị của tham số `next` từ URL

        try {
            const account = await signInWithEmailAndPassword(auth, email, password);
            const user = account.user;

            updateAuthCookie("accessToken", user.stsTokenManager.accessToken, 360);
            updateAuthCookie("refreshToken", user.stsTokenManager.refreshToken, 360);
            window.location.href = next || "/";
            return user;
        } catch (error) {
            console.error("Error signing up:", error);
        }
    };

    const loginWithGoogle = async () => {
        const next = searchParams.get("next"); // Lấy giá trị của tham số `next` từ URL
        try {
            const googleProvider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
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
                    following: [],
                });
            }

            // Lưu token vào cookie
            updateAuthCookie("accessToken", user.stsTokenManager.accessToken, 360);
            updateAuthCookie("refreshToken", user.stsTokenManager.refreshToken, 360);
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
                    following: [],
                });
            }

            // Lưu token vào cookie
            updateAuthCookie("accessToken", user.stsTokenManager.accessToken, 360);
            updateAuthCookie("refreshToken", user.stsTokenManager.refreshToken, 360);
            window.location.href = next || "/";
        } catch (error) {
            console.error("Error logging in with GitHub:", error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            // Xóa token khỏi cookie
            deleteCookie("accessToken");
            deleteCookie("refreshToken");

            // window.location.href = "/login";
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return { loginWithGoogle, loginWithGithub, logout, updateAuthCookie, deleteCookie, sigUpEmail, signinEmail };
};

export default useAuth;
