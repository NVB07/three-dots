"use client";
import { useEffect, useState, useCallback, useContext, memo } from "react";
import { collection, query, onSnapshot, orderBy, doc, getDocs } from "firebase/firestore";
import { fireStore } from "@/firebase/config";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import OptionIcon from "@/components/icons/OptionIcon";
import Message from "./Message";
import ChatInput from "./ChatInput";
import { AuthContext } from "@/auth/AuthProvider";

const ChatContent = () => {
    const currentUserData = useContext(AuthContext);
    // const [listRoomChat, setListRoomChat] = useState([]);

    // useEffect(() => {
    //     const unsubscribe = onSnapshot(collection(fireStore, "roomsChat"), (snapshot) => {
    //         const docsArray = [];
    //         snapshot.forEach((doc) => {
    //             docsArray.push({
    //                 id: doc.id,
    //                 ...doc.data(),
    //             });
    //         });
    //         console.log(docsArray);
    //         setListRoomChat(docsArray);
    //     });

    //     // Cleanup function để unsubscribe khi component bị unmount
    //     return () => unsubscribe();
    // }, []);

    return (
        <>
            <div className="flex justify-between sticky top-0 h-14 z-10 bg-background border-b pt-2 px-3">
                <div className="flex items-center h-fit">
                    <Avatar className="mr-2">
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>IMG</AvatarFallback>
                    </Avatar>
                    <div className="text-lg">Nguyen Van Binh</div>
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
            <ScrollArea className="sm:h-[calc(100vh-194px)] h-[calc(100vh-260px)] w-full rounded-md  pl-3 "></ScrollArea>
            <ChatInput />
        </>
    );
};
const MemoizedMessage = memo(Message);
export default ChatContent;
