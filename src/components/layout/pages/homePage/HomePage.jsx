"use client";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { fireStore } from "@/firebase/config";
import { useEffect, useState, useCallback, useContext, memo } from "react";
import Blog from "../../blog/Blog";
import { AuthContext } from "@/auth/AuthProvider";

const HomePage = () => {
    const currentUserData = useContext(AuthContext);

    const [posts, setPosts] = useState([]);

    const handleConvertDate = useCallback((timestamp) => {
        if (timestamp) {
            const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);

            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();
            const hours = date.getHours();
            const minutes = date.getMinutes();

            const time = `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes} | ${day < 10 ? "0" + day : day}/${
                month < 10 ? "0" + month : month
            }/${year}`;

            return time;
        }
        return "?";
    }, []);

    useEffect(() => {
        const q = query(collection(fireStore, "blogs"), orderBy("createAt", "asc"));
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

    return (
        <main className=" w-full flex justify-center">
            <div className="w-full max-w-[620px] px-0 sm:px-6">
                {posts.map((post) => {
                    return (
                        <MemoizedBlogs
                            key={post.id}
                            currentUserData={currentUserData}
                            blogid={post.id}
                            authorid={post?.data.author.uid}
                            liked={
                                post?.data.post.reaction.comments.findIndex((item) => {
                                    return item.uid === currentUserData?.uid && item.liked === true;
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
        </main>
    );
};

const MemoizedBlogs = memo(Blog);
export default HomePage;
