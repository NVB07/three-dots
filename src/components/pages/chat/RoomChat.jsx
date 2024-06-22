"use client";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { fireStore } from "@/firebase/config";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
const RoomChat = ({ room, authUserData }) => {
    const [friendData, setFriendData] = useState();
    useEffect(() => {
        const getFriend = async () => {
            if (room) {
                const uidFriend = room.user.filter((uid) => uid !== authUserData.uid);
                const docRef = doc(fireStore, "users", uidFriend[0]);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setFriendData(docSnap.data());
                }
            }
        };
        return () => getFriend();
    }, [room]);
    return (
        <Link href={"/chat/" + room?.id} className="w-full my-1 h-16 cursor-pointer hover:bg-accent p-2 pr-5  flex items-center rounded-s-lg">
            <Avatar>
                <AvatarImage src={friendData?.photoURL} alt="@shadcn" />
                <AvatarFallback>?</AvatarFallback>
            </Avatar>
            <div className="ml-2 hidden sm:block text-base line-clamp-2">{friendData ? friendData.displayName : <Skeleton className="h-4  w-28 rounded-lg" />}</div>
        </Link>
    );
};

export default RoomChat;
