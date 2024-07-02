"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getDocument } from "@/firebase/services";
import { Skeleton } from "@/components/ui/skeleton";

const SearchResults = ({ link, authorId, content }) => {
    const [resultData, setResultData] = useState(null);
    useEffect(() => {
        const getData = async () => {
            const docSnap = await getDocument("users", authorId);
            if (docSnap.exists()) {
                setResultData(docSnap.data());
            }
        };
        getData();
    }, []);

    return (
        <Link href={link} className="flex items-center h-16 hover:bg-border rounded-xl p-2 my-1">
            {resultData ? (
                <Image src={resultData?.photoURL} width={36} height={36} className="rounded-full max-h-9 max-w-9 mr-1" alt="img" />
            ) : (
                <Skeleton className={"w-9 h-9 min-w-9 min-h-9 rounded-full"} />
            )}

            <div className="felx flex-col items-start">
                {resultData ? (
                    <Link href={"/user/@" + resultData?.uid} className="hover:underline font-semibold">
                        {resultData?.displayName}
                    </Link>
                ) : (
                    <Skeleton className={"w-36 h-4 mb-1 rounded"} />
                )}
                {resultData ? <p className="text-sm opacity-80 line-clamp-1">{content.toLowerCase()}</p> : <Skeleton className={"w-80 h-4 rounded"} />}
            </div>
        </Link>
    );
};

export default SearchResults;
