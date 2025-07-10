"use client";
import { auth } from "@/firebase/config";
import { useState, useEffect, createContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { getDocument } from "@/firebase/services";

import Loading from "@/components/pages/loading/Loading";
import HandleKey from "@/components/handleKey/HandleKey";
import useAuth from "@/customHook/useAuth";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [authUserData, setAuthUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [privateKey, setPrivateKey] = useState(Cookies.get("privateKey"));
    const router = useRouter();
    const searchParams = useSearchParams().get("next");
    const { updateAuthCookie, logout } = useAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const docSnap = await getDocument("users", user.uid);
                if (docSnap && docSnap.exists()) {
                    setAuthUserData(docSnap.data());
                    updateAuthCookie("accessToken", user.auth.currentUser.stsTokenManager.accessToken, 360);
                    updateAuthCookie("refreshToken", user.auth.currentUser.stsTokenManager.refreshToken, 360);
                    searchParams && router.push("/" + searchParams);
                } else {
                    await logout();
                }
            } else {
                setAuthUserData(null);
                await logout();
                if (searchParams && searchParams !== "/") {
                    router.push(`/login?next=${searchParams}`);
                } else {
                    router.push("/login");
                }
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    if (isLoading) {
        return <Loading />;
    }
    if (!privateKey && authUserData) {
        return <HandleKey setPrivateKey={setPrivateKey} uid={authUserData?.uid} />;
    }

    return <AuthContext.Provider value={{ authUserData, setAuthUserData }}>{authUserData && children}</AuthContext.Provider>;
};

export default AuthProvider;
