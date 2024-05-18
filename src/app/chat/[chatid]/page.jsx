"use client";
import ChatContent from "@/components/layout/pages/chat/ChatContent";
import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { fireStore } from "@/firebase/config";
import { AuthContext } from "@/auth/AuthProvider";
const ChatPage = ({ params }) => {
    const currentUserData = useContext(AuthContext);
    const [permissions, setPermissions] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        const unsub = onSnapshot(doc(fireStore, "roomsChat", params.chatid), (doc) => {
            console.log("Current data: ", doc.data());
            const myPermissions = doc.data().user.find((e) => {
                return e.uid === currentUserData.uid;
            });
            setPermissions(myPermissions);
        });
        setLoading(false);
        console.log("loaded");
        return () => unsub();
    }, [params.chatid]);

    if (loading) {
        return <div className="w-full h-screen flex items-center justify-center">Loading...</div>;
    }
    if (!permissions) {
        return <div className="w-full h-screen flex items-center justify-center">No permissions</div>;
    }
    return (
        <>
            <ChatContent param={params.chatid} />
        </>
    );
};

export default ChatPage;
