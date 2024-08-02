"use client";
// import { useRouter } from "next/navigation";
import { useRouter } from "next13-progressbar";
import { useContext, useEffect, useState, memo, useCallback } from "react";
import { collection, query, onSnapshot, orderBy, where, getCountFromServer, limit, getDocs } from "firebase/firestore";
import { addDocument, snapshotCollection } from "@/firebase/services";
import { fireStore } from "@/firebase/config";
import Image from "next/image";

import { Button } from "@/components/ui/button";

import Blog from "../../blog/Blog";
import { AuthContext } from "@/context/AuthProvider";
import EditProfile from "./EditProfile";
import LoadMore from "@/components/loadMore/LoadMore";
import { Skeleton } from "@/components/ui/skeleton";

const User = ({ param }) => {
    const { authUserData, setAuthUserData } = useContext(AuthContext);

    const [userData, setUserData] = useState();
    const [isMyAccount, setIsMyAccount] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [initialPosts, setInitialPosts] = useState([]);
    const [additionalPosts, setAdditionalPosts] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);

    const router = useRouter();

    useEffect(() => {
        snapshotCollection("users", param.replace("%40", ""), (data) => {
            if (data) {
                setIsMyAccount(data?.uid === authUserData.uid);
                setUserData(data);
            }
            setIsLoading(false);
        });
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

    // useEffect(() => {
    //     const q = query(collection(fireStore, "blogs"), where("author.uid", "==", param.replace("%40", "")), orderBy("createAt", "asc"));
    //     const unsubscribe = onSnapshot(q, (querySnapshot) => {
    //         querySnapshot.docChanges().forEach((change) => {
    //             const doc = change.doc;
    //             const blogData = { data: doc.data(), id: doc.id };
    //             switch (change.type) {
    //                 case "added":
    //                     setPosts((prevPosts) => [blogData, ...prevPosts]);
    //                     break;
    //                 case "modified":
    //                     setPosts((prevPosts) => prevPosts.map((post) => (post.id === doc.id ? blogData : post)));
    //                     break;
    //                 case "removed":
    //                     setPosts((prevPosts) => prevPosts.filter((post) => post.id !== doc.id));
    //                     break;
    //                 default:
    //                     break;
    //             }
    //         });
    //     });
    //     return () => unsubscribe();
    // }, []);

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
                        <h3 className="text-xl font-bold">{isLoading ? <Skeleton className={"w-40 h-7 rounded-md"} /> : userData?.displayName}</h3>
                        <h2 className="text-sm italic mt-2">{userData?.email}</h2>
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
                                    src={userData?.photoURL}
                                    alt="avt"
                                />
                            )
                        )}
                    </div>
                </div>
                {isLoading ? (
                    <Skeleton className={"w-full h-10 rounded-md"} />
                ) : isMyAccount ? (
                    <EditProfile authUserData={authUserData} setAuthUserData={setAuthUserData} />
                ) : (
                    <Button disabled={isLoading} onClick={handleChat} variant="" className="w-full font-bold">
                        Nhắn tin
                    </Button>
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
                    {allPosts.length < countDocument ? (
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
