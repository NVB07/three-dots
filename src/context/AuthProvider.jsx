"use client";
import { auth } from "@/firebase/config";
import { useState, useEffect, createContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/components/pages/loading/Loading";
import useAuth from "@/customHook/useAuth";
import { getDocument } from "@/firebase/services";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [authUserData, setAuthUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const searchParams = useSearchParams().get("next");
    const { updateAuthCookie } = useAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const docSnap = await getDocument("users", user.uid);
                if (docSnap.exists()) {
                    setAuthUserData(docSnap.data());
                    const expirationDate = new Date(user.auth.currentUser.stsTokenManager.expirationTime);
                    updateAuthCookie("accessToken", user.auth.currentUser.stsTokenManager.accessToken, expirationDate);
                    updateAuthCookie("refreshToken", user.auth.currentUser.stsTokenManager.refreshToken, expirationDate);
                } else {
                    const { displayName, email, uid, photoURL } = user;
                    setAuthUserData({ displayName, email, uid, photoURL });
                }
            } else {
                setAuthUserData(null);
                router.push(searchParams && searchParams !== "/" ? `/login?next=${searchParams}` : "/login");
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    if (isLoading) {
        return <Loading />;
    }

    return <AuthContext.Provider value={{ authUserData, setAuthUserData }}>{authUserData && children}</AuthContext.Provider>;
};

export default AuthProvider;
