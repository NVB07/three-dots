"use client";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState, memo, useCallback } from "react";
import { collection, query, onSnapshot, orderBy, where } from "firebase/firestore";
import { fireStore } from "@/firebase/config";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Blog from "../../blog/Blog";
import { AuthContext } from "@/auth/AuthProvider";

const User = ({ param }) => {
    const [userData, setUserData] = useState();
    const authUserData = useContext(AuthContext);
    const [isMyAccount, setIsMyAccount] = useState(false);
    const [posts, setPosts] = useState([]);

    const router = useRouter();
    const pathname = usePathname();
    useEffect(() => {
        if (pathname !== "/user/@" + authUserData.uid) {
            setIsMyAccount(false);
        } else {
            setIsMyAccount(true);
        }
    }, []);

    useEffect(() => {
        const q = query(collection(fireStore, "users"), orderBy("createAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const userArray = [];
            querySnapshot.forEach((doc) => {
                userArray.push({ data: doc.data(), id: doc.id });
            });

            const objUser = userArray.find((item) => {
                if ("%40" + item.data.uid === param) {
                    return 1;
                }
            });

            setUserData(objUser);
        });

        return () => unsubscribe();
    }, []);

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
        const q = query(collection(fireStore, "blogs"), where("author.uid", "==", param.replace("%40", "")), orderBy("createAt", "asc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.docChanges().forEach((change) => {
                const doc = change.doc;
                const blogData = { data: doc.data(), id: doc.id };
                switch (change.type) {
                    case "added":
                        setPosts((prevPosts) => [blogData, ...prevPosts]);
                        break;
                    case "modified":
                        setPosts((prevPosts) => prevPosts.map((post) => (post.id === doc.id ? blogData : post)));
                        break;
                    case "removed":
                        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== doc.id));
                        break;
                    default:
                        break;
                }
            });
        });
        return () => unsubscribe();
    }, []);
    if (!authUserData) {
        router.push("/login");
        return;
    }
    return (
        <div className="w-full ">
            <div className="full flex items-start mb-6">
                <div className="w-1/2">
                    <h3 className="text-xl font-bold">{userData?.data.displayName}</h3>
                    <h2 className="text-sm italic mt-2">{userData?.data.email}</h2>
                </div>
                <div className="w-1/2 flex justify-end">
                    <Image width={80} height={80} className="rounded-full" src={userData?.data.photoURL} alt="avt" />
                </div>
            </div>
            <Button variant="outline" color={!isMyAccount ? "primary" : "warning"} className="w-full font-bold">
                {isMyAccount ? "Edit profile" : "Chat now"}
            </Button>
            <div className="w-full mt-5  p-1 font-semibold">{isMyAccount ? "My blogs" : userData?.data.displayName + "'s blog"}</div>
            <div className="mt-5">
                {posts.map((post) => {
                    return (
                        <MemoizedBlogs
                            key={post.id}
                            currentUserData={authUserData}
                            blogid={post.id}
                            authorid={post?.data.author.uid}
                            liked={
                                post?.data.post.reaction.comments.findIndex((item) => {
                                    return item.uid === authUserData?.uid && item.liked === true;
                                }) !== -1
                            }
                            useURL={"/user/@" + post?.data.author.uid}
                            avatar={post?.data.author.photoURL}
                            username={post?.data.author.displayName}
                            postTime={handleConvertDate(post?.data.createAt)}
                            content={post?.data.post.content}
                            imageSrc={post?.data.post.imageURL}
                            likedCount={post?.data.post.reaction.liked}
                        />
                    );
                })}
            </div>
        </div>
    );
};
const MemoizedBlogs = memo(Blog);
export default User;
