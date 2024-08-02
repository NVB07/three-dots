"use client";
import { useEffect, useState, useContext } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { fireStore } from "@/firebase/config";
import { ScrollArea } from "@/components/ui/scroll-area";
import RoomChat from "./RoomChat";
import { NotificationContext } from "@/context/NotificationProvider";
import { AuthContext } from "@/context/AuthProvider";

const ListRoomChat = () => {
    const { notifications } = useContext(NotificationContext);

    const { authUserData } = useContext(AuthContext);
    const [listRoomChat, setListRoomChat] = useState([]);

    useEffect(() => {
        const q = query(collection(fireStore, "roomsChat"), orderBy("createAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docsWithUserUid = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                if (data.user && data.user.includes(authUserData.uid)) {
                    docsWithUserUid.push({
                        id: doc.id,
                        user: data.user,
                    });
                }
            });
            setListRoomChat(docsWithUserUid);
        });
        return () => unsubscribe();
    }, []);

    return (
        <ScrollArea className="h-[calc(100vh-140px)] w-full rounded-md  sm:pl-3">
            {listRoomChat.map((room) => {
                return <RoomChat room={room} key={room.id} authUserData={authUserData} newMessage={notifications} />;
            })}
        </ScrollArea>
    );
};

export default ListRoomChat;
