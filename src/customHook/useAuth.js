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

            // await sendEmailVerification(user);
            await addUser("users", user.uid, {
                displayName: displayName,
                email: email,
                threads: "",
                facebook: "",
                instagram: "",
                tiktok: "",
                x: "",
                photoURL:
                    "https://firebasestorage.googleapis.com/v0/b/social-chat-d2b4e.appspot.com/o/photoUsers%2Fdefault%20(1).jpg?alt=media&token=8123e758-0629-4866-8250-85ed85ab0066",
                uid: user.uid,
            });
            return user;
        } catch (error) {
            console.error("Error signing up:", error);
            return false;
        }
    };
    const signinEmail = async (email, password) => {
        try {
            const account = await signInWithEmailAndPassword(auth, email, password);
            const user = account.user;
            window.location.href = next || "/";
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
            console.log(user.stsTokenManager);
            const expirationDate = new Date(user.stsTokenManager.expirationTime);

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
            updateAuthCookie("accessToken", user.stsTokenManager.accessToken, expirationDate);
            updateAuthCookie("refreshToken", user.stsTokenManager.refreshToken, expirationDate);
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
            const expirationDate = new Date(user.stsTokenManager.expirationTime);
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
            updateAuthCookie("accessToken", user.stsTokenManager.accessToken, expirationDate);
            updateAuthCookie("refreshToken", user.stsTokenManager.refreshToken, expirationDate);
            window.location.href = next || "/";
        } catch (error) {
            console.error("Error logging in with GitHub:", error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            // Xóa token khỏi cookie
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");

            // window.location.href = "/login";
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return { loginWithGoogle, loginWithGithub, logout, updateAuthCookie, sigUpEmail, signinEmail };
};

export default useAuth;
