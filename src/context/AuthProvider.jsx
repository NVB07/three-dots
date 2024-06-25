"use client";
import { auth } from "@/firebase/config";
import { useState, useEffect, createContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Login from "@/components/pages/login/Login";
import Loading from "@/components/pages/loading/Loading";
import { getDocument } from "@/firebase/services";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [authUserData, setAuthUserData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const getUserData = async () => {
                    const docSnap = await getDocument("users", user.uid);
                    if (docSnap.exists()) {
                        setAuthUserData(docSnap.data());
                        setIsLoading(false);
                    } else {
                        const { displayName, email, uid, photoURL } = user;
                        setAuthUserData({ displayName, email, uid, photoURL });
                        console.log("No such document!");
                    }
                };
                getUserData();
            } else {
                setIsLoading(false);
                setAuthUserData(null);
                router.push("/", { scroll: false });
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ authUserData, setAuthUserData }}>
            {isLoading ? (
                <Loading />
            ) : authUserData ? (
                children
            ) : (
                //
                <Login />
            )}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
