"use client";
import { useRouter } from "next13-progressbar";
import { useContext, useEffect, useState, memo, useCallback } from "react";
import { collection, query, onSnapshot, orderBy, where, getCountFromServer, limit, getDocs } from "firebase/firestore";
import { addDocument, snapshotCollection, followUser } from "@/firebase/services";
import { fireStore } from "@/firebase/config";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import GmailIcon from "@/components/icons/GmailIcon";
import FacebookIcon from "@/components/icons/FacebookIcon";
import InstagramIcon from "@/components/icons/InstagramIcon";
import ThreadsIcon from "@/components/icons/ThreadsIcon";
import TikTokIcon from "@/components/icons/TikTokIcon";
import XIcon from "@/components/icons/XIcon";

import LoadMore from "@/components/loadMore/LoadMore";
import Blog from "../../blog/Blog";
import EditSocial from "./EditSocial";
import { AuthContext } from "@/context/AuthProvider";
import UserName from "@/components/pages/user/UserName";

const User = ({ param }) => {
    const { authUserData, setAuthUserData } = useContext(AuthContext);

    const [userData, setUserData] = useState();
    const [isMyAccount, setIsMyAccount] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [initialPosts, setInitialPosts] = useState([]);
    const [additionalPosts, setAdditionalPosts] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [followTitleButton, setFollowTitleButton] = useState("---");
    const [countFollowing, setCountFollowing] = useState([]);
    const [countFollower, setCountFollower] = useState([]);
    const router = useRouter();

    const handleFollow = async () => {
        setFollowTitleButton("...");
        const title = await followUser(authUserData.uid, param.replace("%40", ""));
        setFollowTitleButton(title);
    };

    useEffect(() => {
        const snapShotUser = snapshotCollection("users", param.replace("%40", ""), (data) => {
            if (data) {
                setIsMyAccount(data?.uid === authUserData.uid);
                setUserData(data);
                setFollowTitleButton(() => {
                    if (data.followers?.includes(authUserData.uid)) {
                        return "Đang theo dõi";
                    } else {
                        return "Theo dõi";
                    }
                });
                setCountFollower(data.followers);
                setCountFollowing(data.following);
            }
            setIsLoading(false);
        });
        () => {
            snapShotUser();
        };
    }, []);

    const [countDocument, setCountDocument] = useState(null);

    useEffect(() => {
        const coll = collection(fireStore, "blogs");
        const q = query(coll, where("author.uid", "==", param.replace("%40", "")), orderBy("createAt", "asc"));
        const unsubscribeCount = onSnapshot(q, async () => {
            const snapshot = await getCountFromServer(q);
            setCountDocument(snapshot.data().count);
        });
        return () => unsubscribeCount();
    }, []);

    const handleChat = async () => {
        if (authUserData && userData) {
            const querySnapshot = await getDocs(query(collection(fireStore, "roomsChat")));
            const docsArray = [];
            querySnapshot.forEach((doc) => {
                docsArray.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            const resultId = docsArray.find((item) => {
                if (item.user?.includes(authUserData.uid) && item.user?.includes(userData.uid)) return item.id;
            });

            if (resultId) {
                router.push("/chat/" + resultId.id);
            } else {
                const addChat = async () => {
                    try {
                        const documentID = await addDocument("roomsChat", {
                            user: [authUserData.uid, userData.uid],
                        });
                        router.push("/chat/" + documentID);
                    } catch (error) {
                        console.error("Error adding document:", error);
                    }
                };
                addChat();
            }
        } else {
            console.error("authUserData or userData is undefined");
        }
    };

    const handleConvertDate = useCallback((timestamp) => {
        if (timestamp) {
            const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);

            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const time = `${hours}:${minutes} | ${day}/${month}/${year}`;

            return time;
        }
        return "?";
    }, []);

    useEffect(() => {
        const initialQuery = query(collection(fireStore, "blogs"), where("author.uid", "==", param.replace("%40", "")), orderBy("createAt", "desc"), limit(20));

        const unsubscribe = onSnapshot(initialQuery, (querySnapshot) => {
            const initialDocs = [];
            let lastVisibleDoc = null;
            querySnapshot.forEach((doc) => {
                initialDocs.push({ data: doc.data(), id: doc.id });

                lastVisibleDoc = doc;
            });

            setInitialPosts(initialDocs);
            setLastVisible(lastVisibleDoc);
        });

        return () => unsubscribe();
    }, []);

    const uniquePostsMap = new Map();
    [...initialPosts, ...additionalPosts].forEach((post) => {
        uniquePostsMap.set(post.id, post);
    });
    const allPosts = Array.from(uniquePostsMap.values());

    if (!isLoading && !userData) {
        return (
            <div className="w-full pt-24 flex items-center justify-center">
                <div className=" p-8 border-border border border-solid rounded-md">
                    <p className="font-bold">Người dùng không tồn tại</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full ">
            <div className="px-3 sm:px-0">
                <div className="full flex items-start mb-6">
                    <div className="w-1/2">
                        <UserName isMyAccount={isMyAccount} authUserData={authUserData} setAuthUserData={setAuthUserData} isLoading={isLoading} userData={userData} />
                        <div className="flex pt-2 items-center gap-1">
                            {userData?.email && (
                                <a href={`mailto:${userData?.email}`} className="rounded-full flex items-center justify-center w-8 h-8  hover:bg-accent p-1">
                                    <GmailIcon width={23} height={23} />
                                </a>
                            )}
                            {userData?.facebook && (
                                <a
                                    href={`https://facebook.com/${userData?.facebook}`}
                                    target="_blank"
                                    className="rounded-full flex items-center justify-center w-8 h-8 hover:bg-accent p-1"
                                >
                                    <FacebookIcon width={20} height={20} />
                                </a>
                            )}
                            {userData?.instagram && (
                                <a
                                    href={`https://www.instagram.com/${userData?.instagram}`}
                                    target="_blank"
                                    className="rounded-full flex items-center justify-center w-8 h-8 hover:bg-accent p-1"
                                >
                                    <InstagramIcon width={19} height={19} />
                                </a>
                            )}
                            {userData?.threads && (
                                <a
                                    href={`https://threads.net/${userData?.threads}`}
                                    target="_blank"
                                    className="rounded-full flex items-center justify-center w-8 h-8 hover:bg-accent p-1"
                                >
                                    <ThreadsIcon width={20} height={20} />
                                </a>
                            )}
                            {userData?.tiktok && (
                                <a
                                    href={`https://tiktok.com/${userData?.tiktok}`}
                                    target="_blank"
                                    className="rounded-full flex items-center justify-center w-8 h-8 hover:bg-accent p-1"
                                >
                                    <TikTokIcon width={22} height={22} />
                                </a>
                            )}
                            {userData?.x && (
                                <a
                                    href={`https://x.com/${userData?.x}`}
                                    target="_blank"
                                    className="rounded-full flex items-center justify-center w-8 h-8 hover:bg-accent p-1"
                                >
                                    <XIcon width={22} height={22} />
                                </a>
                            )}
                        </div>
                    </div>
                    <div className="w-1/2 flex justify-end">
                        {isLoading ? (
                            <Skeleton className={"w-20 h-20 rounded-full"} />
                        ) : (
                            userData && (
                                <Image
                                    width={80}
                                    height={80}
                                    className="rounded-full min-w-20 min-h-20 max-h-20 max-w-20 object-cover"
                                    placeholder="blur"
                                    blurDataURL="/blur.png"
                                    src={userData?.photoURL || "/avatarDefault.svg"}
                                    alt="avt"
                                />
                            )
                        )}
                    </div>
                </div>
                <div className="w-full my-3">
                    {isLoading ? (
                        <Skeleton className={"w-full h-4 rounded-md"} />
                    ) : (
                        <div className="flex items-center justify-between ">
                            <p className="text-sm ">{countDocument} bài viết</p>
                            <Dialog>
                                <DialogTrigger>
                                    <p className="text-sm ">{countFollower.length} người theo dõi</p>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>comming soon !</DialogTitle>
                                        <DialogDescription>comming soon</DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                            <Dialog>
                                <DialogTrigger>
                                    <p className="text-sm ">Đang theo dõi {countFollowing.length} người</p>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>comming soon !</DialogTitle>
                                        <DialogDescription>comming soon</DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}
                </div>
                {isLoading ? (
                    <Skeleton className={"w-full h-10 rounded-md"} />
                ) : isMyAccount ? (
                    <EditSocial authUserData={authUserData} setAuthUserData={setAuthUserData} />
                ) : (
                    <div className="w-full flex items-center gap-2">
                        <Button
                            onClick={handleFollow}
                            variant=""
                            className="w-full font-bold bg-[#ccc] text-black hover:bg-[#ddd] dark:bg-[#25292e] dark:hover:bg-[#40464e] dark:text-white"
                        >
                            {followTitleButton}
                        </Button>
                        <Button onClick={handleChat} variant="" className="w-full font-bold bg-blue-500 text-white hover:bg-blue-400">
                            Nhắn tin
                        </Button>
                    </div>
                )}
                {isLoading ? (
                    <Skeleton className={"w-96 h-8 rounded mt-5 "} />
                ) : (
                    <div className="w-full mt-5  p-1 font-semibold">{isMyAccount ? "Bài viết của tôi" : "Bài viết của " + userData?.displayName}</div>
                )}
            </div>
            <div className="mt-2">
                {allPosts.map((post) => {
                    return (
                        <MemoizedBlogs
                            key={post.id}
                            currentUserData={authUserData}
                            blogid={post.id}
                            authorid={post?.data.author.uid}
                            liked={post?.data.liked?.find((uid) => {
                                return uid === authUserData?.uid;
                            })}
                            authorUserData={userData}
                            useURL={"/user/@" + post?.data.author.uid}
                            avatar={post?.data.author.photoURL}
                            username={post?.data.author.displayName}
                            postTime={handleConvertDate(post?.data.createAt)}
                            content={post?.data.post.content}
                            imageSrc={post?.data.post.imageURL}
                            likedCount={post?.data.liked?.length}
                        />
                    );
                })}
                <div className="w-full flex justify-center py-10">
                    {allPosts.length < countDocument && countDocument > 20 ? (
                        <LoadMore
                            lastVisible={lastVisible}
                            setAdditionalPosts={setAdditionalPosts}
                            setLastVisible={setLastVisible}
                            collectionName={"blogs"}
                            queryParam={[where("author.uid", "==", param.replace("%40", "")), orderBy("createAt", "desc")]}
                        />
                    ) : null}
                </div>
            </div>
        </div>
    );
};
const MemoizedBlogs = memo(Blog);
export default User;
