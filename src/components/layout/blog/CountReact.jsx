"use client";
import { useState, useEffect } from "react";
import { snapshotDocument } from "@/firebase/services";

const CountReact = ({ blogid, like }) => {
    const [countComment, setCountComment] = useState(0);
    useEffect(() => {
        const unsubscribe = snapshotDocument("blogs", blogid, "interact", (data) => {
            setCountComment(data?.length);
        });

        return () => unsubscribe(); // Unsubscribe khi component unmount
    }, []);
    return (
        <div className="w-full mt-2.5 flex ">
            <div className=" text-[#acacac] text-sm mr-1">{like} lượt thích, </div>
            <div className=" text-[#acacac] text-sm"> {countComment} bình luận</div>
        </div>
    );
};

export default CountReact;
