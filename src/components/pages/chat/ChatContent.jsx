"use client";
import { useContext, useEffect, useState, memo } from "react";
import { collection, query, onSnapshot, orderBy, doc } from "firebase/firestore";
import { fireStore } from "@/firebase/config";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import OptionIcon from "@/components/icons/OptionIcon";
import Message from "./Message";
import ChatInput from "./ChatInput";
import { AuthContext } from "@/auth/AuthProvider";

const ChatContent = ({ param }) => {
    const currentUserData = useContext(AuthContext);
    const [messageData, setMessageData] = useState([]);
    const [friendData, setFriendData] = useState();

    useEffect(() => {
        const q = query(collection(fireStore, "roomsChat", param, "chat"), orderBy("sendTime", "asc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.docChanges().forEach((change) => {
                const doc = change.doc;
                const messageData = { data: doc.data(), id: doc.id };
                switch (change.type) {
                    case "added":
                        setMessageData((prevData) => [messageData, ...prevData]);
                        break;
                    case "modified":
                        setMessageData((prevData) => prevData.map((post) => (post.id === doc.id ? messageData : post)));
                        break;
                    case "removed":
                        setMessageData((prevData) => prevData.filter((post) => post.id !== doc.id));
                        break;
                    default:
                        break;
                }
            });
        });
        return () => unsubscribe();
    }, []);
    useEffect(() => {
        const unsub = onSnapshot(doc(fireStore, "roomsChat", param), (doc) => {
            console.log("Current data: ", doc.data());
            const frientData = doc.data().user.find((e) => {
                return e.uid !== currentUserData.uid;
            });
            setFriendData(frientData);
        });
        return () => unsub();
    }, []);

    return (
        <>
            <div className="flex justify-between sticky top-0 h-14 z-10 bg-background border-b pt-2 px-3">
                <div className="flex items-center h-fit">
                    <Avatar className="mr-2">
                        <AvatarImage src={friendData?.photoURL} alt="@shadcn" />
                        <AvatarFallback>IMG</AvatarFallback>
                    </Avatar>
                    <div className="text-lg">{friendData?.name}</div>
                </div>
                <div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full w-7 h-7">
                                <OptionIcon width={24} height={24} />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full  flex flex-col p-0">
                            <Button variant="ghost" className=" rounded-b-none">
                                Xem trang cá nhân
                            </Button>
                            <Button variant="ghost" className="rounded-t-none flex justify-start text-[#f14b5c] hover:text-[#f14b5c]">
                                Xóa đoạn chat
                            </Button>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <ScrollArea className="sm:h-[calc(100vh-194px)] h-[calc(100vh-260px)] w-full rounded-md  pl-3 ">
                {messageData
                    .slice()
                    .reverse()
                    .map((chat) => {
                        return (
                            <MemoizedMessage
                                key={chat.id}
                                message={chat.data.content}
                                myMessage={chat.data.uid === currentUserData.uid}
                                photoURL={friendData?.photoURL}
                            />
                        );
                    })}
            </ScrollArea>
            <ChatInput documentId={param} currentUserData={currentUserData} />
        </>
    );
};
const MemoizedMessage = memo(Message);
export default ChatContent;
