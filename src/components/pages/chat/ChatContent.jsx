"use client";
import { useContext, useEffect, useState, useRef, memo } from "react";
import { useRouter } from "next/navigation";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { fireStore } from "@/firebase/config";
import Cookies from "js-cookie";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import {
//     AlertDialog,
//     AlertDialogAction,
//     AlertDialogCancel,
//     AlertDialogContent,
//     AlertDialogDescription,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogTitle,
//     AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import Message from "./Message";
import ChatInput from "./ChatInput";
import OptionIcon from "@/components/icons/OptionIcon";
// import CloseIcon from "@/components/icons/CloseIcon";
// import TrashIcon from "@/components/icons/TrashIcon";
import { Skeleton } from "@/components/ui/skeleton";
import { getDocument } from "@/firebase/services";
//context

import { AuthContext } from "@/context/AuthProvider";
import Image from "next/image";

const ChatContent = ({ param, users }) => {
    const router = useRouter();
    const { authUserData } = useContext(AuthContext);
    const [messageData, setMessageData] = useState([]);
    const [friendData, setFriendData] = useState();
    const [loading, setLoading] = useState(true);

    const scrollableRef = useRef(null);
    const scrollBarStyle = `::-webkit-scrollbar {width: 7px;}::-webkit-scrollbar-track {background: transparent;}::-webkit-scrollbar-thumb {background: hsl(var(--border)); border-radius:9999px;}::-webkit-scrollbar-thumb:hover {}`;

    useEffect(() => {
        const q = query(collection(fireStore, "roomsChat", param, "chat"), orderBy("sendTime", "asc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let messageArray = [];
            querySnapshot.forEach((doc) => {
                messageArray.push({ data: doc.data(), id: doc.id });
            });
            // setLoading(false);
            // setNotifications(messageArray.slice(-1)[0]?.data.uid !== authUserData.uid);
            setMessageData(messageArray);
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
                    setLoading(false);
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
        <div className="flex-1 w-full h-[calc(100vh-140px)] sm:h-[calc(100vh-74px)] overflow-y-hidden">
            <div className="flex justify-between sticky top-0 h-14 z-10 bg-background border-b pt-2 px-3">
                <div className="flex items-center h-fit">
                    {loading ? (
                        <Skeleton className={"w-10 h-10 rounded-full mr-2"} />
                    ) : (
                        <Image
                            src={friendData?.photoURL || "/avatarDefault.svg"}
                            width={40}
                            height={40}
                            className="max-w-10 mr-2 max-h-10 rounded-full object-cover"
                            alt="@shadcn"
                        />
                    )}

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
            <div ref={scrollableRef} className="h-[calc(100vh-260px)] sm:h-[calc(100vh-194px)] w-full rounded-md overflow-y-scroll pl-3 ">
                <style>{scrollBarStyle}</style>
                {loading ? (
                    <div>
                        <div className="flex items-center justify-start my-3 mr-4">
                            <Skeleton className={"w-7 h-7 rounded-full"} />
                            <Skeleton className={"w-1/2 h-7 ml-1.5 rounded-2xl"} />
                        </div>
                        <div className="flex items-center justify-start my-3 mr-4">
                            <Skeleton className={"w-7 h-7 rounded-full"} />
                            <Skeleton className={"w-1/3 h-7 ml-1.5 rounded-2xl"} />
                        </div>
                        <div className="flex items-center justify-end my-3 mr-4">
                            <Skeleton className={"w-1/2 h-7  rounded-2xl"} />
                        </div>
                        <div className="flex items-center justify-start my-3 mr-4">
                            <Skeleton className={"w-7 h-7 rounded-full"} />
                            <Skeleton className={"w-2/3 h-7 ml-1.5 rounded-2xl"} />
                        </div>
                    </div>
                ) : (
                    messageData.slice().map((chat) => {
                        return (
                            <MemoizedMessage
                                key={chat.id}
                                data={chat.data}
                                message={chat.data.content}
                                myMessage={chat.data.uid === authUserData.uid}
                                photoURL={friendData?.photoURL}
                                rsaKey={Cookies.get("privateKey")}
                            />
                        );
                    })
                )}
            </div>
            <ChatInput documentId={param} currentUserData={authUserData} messageData={messageData} scrollRef={scrollableRef} friendData={friendData} />
        </div>
    );
};
const MemoizedMessage = memo(Message);
export default ChatContent;
