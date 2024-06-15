"use client";
import { auth } from "@/firebase/config";
import { useState, useEffect, createContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { fireStore } from "@/firebase/config";
import { getDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Login from "@/components/pages/login/Login";
import Loading from "@/components/pages/loading/Loading";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [authUserData, setAuthUserData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            // console.log(user);
            if (user) {
                const docRef = doc(fireStore, "users", user.uid);
                const getDocument = async () => {
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        // console.log("Document data:", docSnap.data());
                        setAuthUserData(docSnap.data());
                        setIsLoading(false);
                    } else {
                        const { displayName, email, uid, photoURL } = user;

                        setAuthUserData({ displayName, email, uid, photoURL });
                        console.log("No such document!");
                    }
                };
                getDocument();

                // const { displayName, email, uid, photoURL } = user;

                // setUserData({ displayName, email, uid, photoURL });
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
