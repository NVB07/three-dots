"use client";
import { useState, useEffect } from "react";
import { snapshotSubColection } from "@/firebase/services";

const CountReact = ({ blogid, like }) => {
    const [countComment, setCountComment] = useState(0);
    useEffect(() => {
        const unsubscribe = snapshotSubColection("blogs", blogid, "interact", (data) => {
            setCountComment(data?.length);
        });

        return () => unsubscribe(); // Unsubscribe khi component unmount
    }, []);
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
};

export default CountReact;
