"use client";
import { useContext, useEffect, useState, useRef, memo } from "react";
import { useRouter } from "next/navigation";
import { collection, query, orderBy, limit, startAfter, getDocs, onSnapshot } from "firebase/firestore";
import { fireStore } from "@/firebase/config";
import Cookies from "js-cookie";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import Message from "./Message";
import ChatInput from "./ChatInput";
import OptionIcon from "@/components/icons/OptionIcon";
import { Skeleton } from "@/components/ui/skeleton";
import { getDocument } from "@/firebase/services";
import { AuthContext } from "@/context/AuthProvider";
import Image from "next/image";
import NodeRSA from "node-rsa";
import aesjs from "aes-js";

const ChatContent = ({ param, users }) => {
    const router = useRouter();
    const { authUserData } = useContext(AuthContext);
    const [messageData, setMessageData] = useState([]);
    const [friendData, setFriendData] = useState();
    const [loading, setLoading] = useState(true);
    const [loadingOlderMessages, setLoadingOlderMessages] = useState(false);
    const [lastVisible, setLastVisible] = useState(null);
    const scrollableRef = useRef(null);
    const [hasMore, setHasMore] = useState(true);
    const scrollBarStyle = `::-webkit-scrollbar {width: 7px;}::-webkit-scrollbar-track {background: transparent;}::-webkit-scrollbar-thumb {background: hsl(var(--border)); border-radius:9999px;}::-webkit-scrollbar-thumb:hover {}`;

    const scrollToBottom = () => {
        scrollableRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const decryptMessage = (chat, rsaKey, myUid) => {
        try {
            const key = new NodeRSA(rsaKey);
            key.setOptions({ encryptionScheme: "pkcs1" });

            const aesKeyEncrypted = chat.uid === myUid ? chat.aesKeySenderEncrypted : chat.aesKeyReceiverEncrypted;
            const encryptedBuffer = Buffer.from(aesKeyEncrypted, "base64");
            const aesKeyString = key.decrypt(encryptedBuffer, "utf8");

            const encryptedBytes = Uint8Array.from(atob(chat.content), (c) => c.charCodeAt(0));
            const keyBytes = aesjs.utils.hex.toBytes(aesKeyString);
            const ivBytes = aesjs.utils.hex.toBytes(chat.iv);
            const aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, ivBytes);
            const decryptedBytes = aesCbc.decrypt(encryptedBytes);
            const unpadded = aesjs.padding.pkcs7.strip(decryptedBytes);
            const decryptedText = aesjs.utils.utf8.fromBytes(unpadded);

            return decryptedText;
        } catch (e) {
            console.error("Giải mã lỗi", e);
            return null;
        }
    };

    const loadMessages = async (isInitial = false) => {
        if (!isInitial) setLoadingOlderMessages(true);

        const q = isInitial
            ? query(collection(fireStore, "roomsChat", param, "chat"), orderBy("sendTime", "desc"), limit(15))
            : query(collection(fireStore, "roomsChat", param, "chat"), orderBy("sendTime", "desc"), startAfter(lastVisible), limit(15));

        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs;

        const newMessages = docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
            decryptedContent: decryptMessage(doc.data(), Cookies.get("privateKey"), authUserData.uid),
        }));

        const sortedMessages = [...newMessages].sort((a, b) => a.data.sendTime - b.data.sendTime);

        setMessageData((prev) => {
            if (isInitial) {
                return sortedMessages;
            } else {
                return [...sortedMessages, ...prev];
            }
        });
        if (docs.length < 15) {
            setHasMore(false); // Hết tin nhắn để load thêm
        }
        if (docs.length > 0) {
            setLastVisible(docs[docs.length - 1]);
        }

        setLoading(false);
        setLoadingOlderMessages(false);

        if (isInitial) {
            setTimeout(() => scrollToBottom(), 0); // Scroll ngay sau khi render
        }
    };

    // Load lần đầu
    useEffect(() => {
        loadMessages(true);
    }, []);

    // Lắng nghe tin nhắn mới
    useEffect(() => {
        const q = query(collection(fireStore, "roomsChat", param, "chat"), orderBy("sendTime", "desc"), limit(1));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const doc = change.doc;
                    const decrypted = decryptMessage(doc.data(), Cookies.get("privateKey"), authUserData.uid);

                    setMessageData((prev) => {
                        if (prev.some((m) => m.id === doc.id)) return prev;

                        return [
                            ...prev,
                            {
                                id: doc.id,
                                data: doc.data(),
                                decryptedContent: decrypted,
                            },
                        ];
                    });

                    scrollToBottom();
                }
            });
        });

        return () => unsubscribe();
    }, []);

    // Lấy thông tin bạn chat
    useEffect(() => {
        const getFriend = async () => {
            if (users) {
                const uidFriend = users.find((uid) => uid !== authUserData.uid);
                const docSnap = await getDocument("users", uidFriend);
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
                            alt="@friend"
                        />
                    )}
                    <div className="text-lg">{friendData?.displayName || <Skeleton className={"w-52 h-6 rounded-3xl"} />}</div>
                </div>
                <div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full w-7 h-7">
                                <OptionIcon width={24} height={24} />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full flex flex-col p-0">
                            <Button onClick={viewProfile} variant="ghost" className="rounded-b-none">
                                Xem trang cá nhân
                            </Button>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="h-[calc(100vh-260px)] sm:h-[calc(100vh-194px)] w-full rounded-md overflow-y-scroll pl-3 ">
                <style>{scrollBarStyle}</style>

                {hasMore && !loadingOlderMessages && lastVisible && messageData.length > 0 && (
                    <div className="flex justify-center my-3">
                        <button onClick={() => loadMessages(false)} className="text-xs text-blue-500">
                            Tải thêm tin nhắn trước đó
                        </button>
                    </div>
                )}

                {loadingOlderMessages && (
                    <div className="flex justify-center my-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                    </div>
                )}

                {loading ? (
                    <div>
                        <Skeleton className={"w-7 h-7 rounded-full my-3"} />
                        <Skeleton className={"w-1/2 h-7 ml-1.5 rounded-2xl my-3"} />
                    </div>
                ) : (
                    messageData.map((chat) => (
                        <MemoizedMessage key={chat.id} message={chat.decryptedContent} myMessage={chat.data.uid === authUserData.uid} photoURL={friendData?.photoURL} />
                    ))
                )}

                <div ref={scrollableRef} className="w-1 h-0"></div>
            </div>

            <ChatInput documentId={param} currentUserData={authUserData} messageData={messageData} scrollToBottom={scrollToBottom} friendData={friendData} />
        </div>
    );
};

const MemoizedMessage = memo(Message);
export default ChatContent;
