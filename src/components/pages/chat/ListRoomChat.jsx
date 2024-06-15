"use client";
import { useEffect, useState, useContext } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { fireStore } from "@/firebase/config";
import { ScrollArea } from "@/components/ui/scroll-area";
import RoomChat from "./RoomChat";
import { AuthContext } from "@/auth/AuthProvider";

const ListRoomChat = () => {
    const { authUserData } = useContext(AuthContext);
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

            const resultId = docsArray.filter((item) => item.user.some((user) => user.uid === authUserData.uid));

            resultId ? setListRoomChat(resultId) : null;
        });
        return () => unsubscribe();
    }, []);
    return (
        <ScrollArea className="h-[calc(100vh-140px)] w-full rounded-md  sm:pl-3">
            {listRoomChat.map((room) => {
                const friendData = room.user.find(function (e) {
                    return e.uid !== authUserData.uid;
                });

                return <RoomChat uid={room.id} key={room.id} name={friendData.name} avatarSRC={friendData.photoURL} />;
            })}
        </ScrollArea>
    );
};

export default ListRoomChat;
