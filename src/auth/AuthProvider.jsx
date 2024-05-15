"use client";
import { auth } from "@/firebase/config";
import { useState, useEffect, createContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Login from "@/components/layout/pages/login/Login";
import Loading from "@/components/layout/pages/loading/Loading";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const { displayName, email, uid, photoURL } = user;
                setIsLoading(false);
                setUserData({ displayName, email, uid, photoURL });
            } else {
                setIsLoading(false);
                setUserData(null);
                router.push("/", { scroll: false });
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={userData}>
            {isLoading ? (
                <Loading />
            ) : userData ? (
                children
            ) : (
                //
                <Login />
            )}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
