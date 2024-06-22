"use client";
import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState, memo, useCallback } from "react";
import { fireStore } from "@/firebase/config";
import { AuthContext } from "@/context/AuthProvider";
import Blog from "@/components/blog/Blog";
import Comment from "@/components/pages/comment/Comment";

const BlogPage = ({ params }) => {
    const { authUserData } = useContext(AuthContext);
    const [blogData, setBlogData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const unsub = onSnapshot(doc(fireStore, "blogs", params.blogid), (doc) => {
            const data = doc.data();
            setBlogData(data);
        });
        setLoading(false);

        return () => unsub();
    }, [params.blogid]);

    const handleConvertDate = useCallback((timestamp) => {
        if (timestamp) {
            const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);

            const year = date.getFullYear();
            const month = date.getMonth() + 1;
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

    return (
        <main className=" w-full flex justify-center">
            <div className="w-full max-w-[620px] px-0 sm:px-6">
                <MemoizedBlogs
                    blogDetails
                    currentUserData={authUserData}
                    blogid={params.blogid}
                    authorid={blogData?.author.uid}
                    liked={blogData?.liked?.find((uid) => {
                        return uid === authUserData?.uid;
                    })}
                    userURL={"/user/@" + blogData?.author.uid}
                    postTime={handleConvertDate(blogData?.createAt)}
                    content={blogData?.post.content}
                    imageSrc={blogData?.post.imageURL}
                    likedCount={blogData?.liked?.length}
                />

                <div className="w-auto h-[1px] bg-[#8a8a8a3f] "></div>
                <Comment currentUser={authUserData} blogId={params.blogid} />
            </div>
        </main>
    );
};
const MemoizedBlogs = memo(Blog);
export default BlogPage;
