"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getDocument } from "@/firebase/services";
const RoomChat = ({ room, authUserData, newMessage = [] }) => {
    const notification = newMessage.find((id) => id === room.id);
    const [friendData, setFriendData] = useState();
    useEffect(() => {
        const getFriend = async () => {
            if (room) {
                const uidFriend = room.user.filter((uid) => uid !== authUserData.uid);
                const docSnap = await getDocument("users", uidFriend[0]);
                if (docSnap.exists()) {
                    setFriendData(docSnap.data());
                }
            }
        };
        getFriend();
    }, [room]);
    return (
        <Link href={"/chat/" + room?.id} className="w-full my-1 h-16 cursor-pointer hover:bg-accent p-2 pr-5  flex items-center rounded-s-lg">
            <Avatar>
                <AvatarImage src={friendData?.photoURL} alt="@shadcn" />
                <AvatarFallback></AvatarFallback>
            </Avatar>
            <div className="ml-2  text-base line-clamp-2 flex-1">
                <div className={`${notification ? "font-bold" : "font-normal"}`}>
                    {friendData ? friendData.displayName : <Skeleton className="h-4  w-28 rounded-lg" />}
                </div>
                <div className="italic text-xs text-amber-600"> {notification && "Có tin nhắn mới"}</div>
            </div>
        </Link>
    );
};

export default RoomChat;
