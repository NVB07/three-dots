"use client";
import { useContext, useEffect, useState, useRef, memo } from "react";
import { useRouter } from "next/navigation";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
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
import Message from "./Message";
import ChatInput from "./ChatInput";
import OptionIcon from "@/components/icons/OptionIcon";
import CloseIcon from "@/components/icons/CloseIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import { AuthContext } from "@/context/AuthProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { getDocument } from "@/firebase/services";

const ChatContent = ({ param, users }) => {
    const router = useRouter();
    const { authUserData } = useContext(AuthContext);
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
        const getFriend = async () => {
            if (users) {
                const uidFriend = users.filter((uid) => uid !== authUserData.uid);
                const docSnap = await getDocument("users", uidFriend[0]);
                if (docSnap.exists()) {
                    setFriendData(docSnap.data());
                    document.title = "Nhắn tin với " + docSnap.data().displayName;
                }
            }
        };
        getFriend();
    }, [users]);

    const viewProfile = () => {
        router.push("/user/@" + friendData?.uid);
    };

    return (
        <>
            <div className="flex justify-between sticky top-0 h-14 z-10 bg-background border-b pt-2 px-3">
                <div className="flex items-center h-fit">
                    <Avatar className="mr-2">
                        <AvatarImage src={friendData?.photoURL} alt="@shadcn" />
                        <AvatarFallback></AvatarFallback>
                    </Avatar>
                    <div className="text-lg">{friendData?.displayName ? friendData?.displayName : <Skeleton className={"w-52 h-6 rounded-3xl"} />}</div>
                </div>
                <div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full w-7 h-7">
                                <OptionIcon width={24} height={24} />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full  flex flex-col p-0">
                            <Button onClick={viewProfile} variant="ghost" className=" rounded-b-none">
                                Xem trang cá nhân
                            </Button>
                            {/* <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" className="text-[#f14b5c] hover:text-[#f14b5c] rounded-t-none text-left">
                                        <span className="w-full block text-base">Xóa đoạn chat</span>
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>bạn có muốn xóa đoạn chat này ?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Việc xóa đoạn chat sẽ không thể khôi phục trong tương lai.<br></br> Hãy cân nhắc trước khi xác nhận xóa.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog> */}
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
                            <MemoizedMessage key={chat.id} message={chat.data.content} myMessage={chat.data.uid === authUserData.uid} photoURL={friendData?.photoURL} />
                        );
                    })}
            </ScrollArea>
            <ChatInput documentId={param} currentUserData={authUserData} />
        </>
    );
};
const MemoizedMessage = memo(Message);
export default ChatContent;
