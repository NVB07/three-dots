"use client";
import { useEffect, useState, useContext } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { fireStore } from "@/firebase/config";
import { ScrollArea } from "@/components/ui/scroll-area";
import RoomChat from "./RoomChat";
import { AuthContext } from "@/auth/AuthProvider";

const ListRoomChat = () => {
    const currentUserData = useContext(AuthContext);
    const [listRoomChat, setListRoomChat] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(fireStore, "roomsChat"), (snapshot) => {
            const docsArray = [];
            snapshot.forEach((doc) => {
                docsArray.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });

            setListRoomChat(docsArray);
        });

        return () => unsubscribe();
    }, []);
    return (
        <ScrollArea className="h-[calc(100vh-140px)] w-full rounded-md  sm:pl-3">
            {listRoomChat.map((room) => {
                const friendData = room.chat.find(function (e) {
                    return e.uid !== currentUserData.uid;
                });

                return <RoomChat key={room.id} name={friendData.name} avatarSRC={friendData.photoURL} />;
                // return
            })}
        </ScrollArea>
    );
};

export default ListRoomChat;
