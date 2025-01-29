"use client";
import { useState, useEffect } from "react";
import { snapshotSubColection } from "@/firebase/services";
import DialogComment from "./DialogComment";

const CountReact = ({ blogid, like, thisBlogData, authorData, authCurrentUser, likePost, imageLoader, handleLikePost, handleCopyLink, openDialog = false }) => {
    const [countComment, setCountComment] = useState(0);
    useEffect(() => {
        const unsubscribe = snapshotSubColection("blogs", blogid, "comments", (data) => {
            setCountComment(data?.length);
        });

        return () => unsubscribe(); // Unsubscribe khi component unmount
    }, []);
    if (openDialog) {
        return (
            <div className="w-full mt-2.5 flex ">
                <div className=" text-[#acacac] text-sm ">{like} lượt thích </div>
                {countComment === 0 ? null : (
                    <div className=" text-[#acacac] text-sm">
                        <span className="mr-1">,</span> {countComment} bình luận
                    </div>
                )}
            </div>
        );
    }
    return (
        <DialogComment
            thisBlogData={thisBlogData}
            authorData={authorData}
            handleCopyLink={handleCopyLink}
            handleLikePost={handleLikePost}
            blogid={blogid}
            imageLoader={imageLoader}
            likePost={likePost}
            authCurrentUser={authCurrentUser}
        >
            <div className="w-full mt-2.5 flex ">
                <div className="w-fit flex items-center text-[#acacac] text-sm cursor-pointer hover:underline">
                    <div className=" text-[#acacac] text-sm ">{like} lượt thích </div>
                    {countComment === 0 ? null : (
                        <div className=" text-[#acacac] text-sm">
                            <span className="mr-1">,</span> {countComment} bình luận
                        </div>
                    )}
                </div>
            </div>
        </DialogComment>
    );
};

export default CountReact;
