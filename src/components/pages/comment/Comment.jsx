"use client";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { fireStore } from "@/firebase/config";
import { addSubDocument } from "@/firebase/services";
import { useRef, useState, useEffect, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import ShareIcon from "@/components/icons/ShareIcon";
import CommentItem from "./CommentItem";

const Comment = ({ currentUser, blogId }) => {
    const [commentValue, setCommentValue] = useState("");
    const [commentArray, setCommentArray] = useState([]);
    const textareaRef = useRef(null);

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
        return null;
    }, []);

    const handleInputText = (e) => {
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";
        setCommentValue(e.target.value);
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (commentValue.trim()) {
                handleSendComment();
            }
        }
    };

    const handleSendComment = () => {
        const formattedComment = commentValue.trim().replace(/\n/g, "|~n|");
        addSubDocument("blogs", blogId, "comments", {
            comment: formattedComment,
            uid: currentUser?.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
        });
        setCommentValue("");
        textareaRef.current.style.height = "40px";
    };

    // useEffect(() => {
    //     const q = query(collection(fireStore, "blogs", blogId, "comments"), orderBy("sendTime", "asc"));

    //     const unsubscribe = onSnapshot(q, (querySnapshot) => {
    //         querySnapshot.docChanges().forEach((change) => {
    //             const doc = change.doc;
    //             const commentData = { data: doc.data(), id: doc.id };

    //             switch (change.type) {
    //                 case "added":
    //                     setCommentArray((prev) => [commentData, ...prev]);
    //                     break;
    //                 case "modified":
    //                     setCommentArray((prev) => prev.map((post) => (post.id === doc.id ? commentData : post)));
    //                     break;
    //                 case "removed":
    //                     setCommentArray((prev) => prev.filter((post) => post.id !== doc.id));
    //                     break;
    //                 default:
    //                     break;
    //             }
    //         });
    //     });

    //     return () => unsubscribe();
    // }, []);

    useEffect(() => {
        const q = query(collection(fireStore, "blogs", blogId, "comments"), orderBy("sendTime", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let commentArrayTemp = [];
            querySnapshot.forEach((doc) => {
                commentArrayTemp.push({ data: doc.data(), id: doc.id });
            });
            setCommentArray(commentArrayTemp);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="w-full pt-2">
            <div className="w-full flex items-start px-3 pb-3">
                <div className="w-12 pt-0.5">
                    {/* <Avatar className="w-9  h-9 ">
                        <AvatarImage src={currentUser?.photoURL} alt="@shadcn" />
                        <AvatarFallback>TD</AvatarFallback>
                    </Avatar> */}
                    {currentUser?.photoURL ? (
                        <Image
                            src={currentUser?.photoURL}
                            width={36}
                            height={36}
                            alt={"Ảnh đại diện của " + currentUser?.displayName}
                            className="w-9 h-9 rounded-full "
                            quality={50}
                        />
                    ) : (
                        <Skeleton className="h-9 w-9 rounded-full" />
                    )}
                </div>
                <div className="flex relative flex-1 rounded-2xl bg-[hsl(var(--foreground)/5%)]">
                    <Textarea
                        rows={1}
                        ref={textareaRef}
                        value={commentValue}
                        onChange={handleInputText}
                        onKeyDown={handleKeyDown}
                        placeholder="Bình luận"
                        className="outline-none rounded-2xl resize-none h-10 min-h-10 max-h-64 text-base bg-transparent pr-10"
                    />
                    {commentValue.trim() ? (
                        <button
                            onClick={handleSendComment}
                            variant="ghost"
                            size="icon"
                            className="rounded-full w-7 h-7 hover:bg-transparent absolute right-2 bottom-1/2 translate-y-1/2 rotate-[25deg]"
                        >
                            <ShareIcon color="#0095f6" />
                        </button>
                    ) : null}
                </div>
            </div>
            <div className="w-full h-fit">
                {commentArray.map((data) => {
                    return (
                        <CommentItem
                            currentUser={currentUser}
                            key={data.id}
                            commentId={data?.id}
                            blogId={blogId}
                            content={data?.data.comment}
                            displayName={data?.data.displayName}
                            time={handleConvertDate(data?.data.sendTime)}
                            photoURL={data?.data.photoURL}
                            uid={data?.data.uid}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Comment;
