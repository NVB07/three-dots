"use client";
import ChatContent from "@/components/pages/chat/ChatContent";
import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { fireStore } from "@/firebase/config";
import { AuthContext } from "@/context/AuthProvider";
const ChatPage = ({ params }) => {
    const { authUserData } = useContext(AuthContext);
    const [permissions, setPermissions] = useState(false);
    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        const unsub = onSnapshot(doc(fireStore, "roomsChat", params.chatid), (doc) => {
            const data = doc.data();
            if (data && data.user && data.user.includes(authUserData.uid)) {
                setPermissions(true);
                setUsers(data.user);
            }
        });
        setLoading(false);

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
            <ChatContent param={params.chatid} users={users} />
        </>
    );
};

export default ChatPage;
