"use client";
import Link from "next/link";
import { useState, Fragment, useCallback } from "react";
import Image from "next/image";
import { Heart, MessageCircleMore, Send } from "lucide-react";
import { deleteDocument, handleReact } from "@/firebase/services";

const Blog = ({
    blogid,
    authorid,
    currentUserData,
    liked,
    useURL = "/",
    imageSrc,
    avatar = "/default_avt.jpg",
    username = "null?",
    postTime = "",
    content = "",
    likedCount = 0,
}) => {
    const isAuthor = currentUserData?.uid === authorid;
    const [likePost, setLikePost] = useState(liked);

    const getPathImage = useCallback(() => {
        if (imageSrc) {
            const startIndex = imageSrc.lastIndexOf("/") + 1;
            const endIndex = imageSrc.indexOf("?alt=");
            const encodedImagePath = imageSrc.substring(startIndex, endIndex);

            return decodeURIComponent(encodedImagePath);
        }
        return null;
    }, []);

    // get path image
    const parts = content.split("|~n|");
    const elements = parts.map((part, index) => (
        <Fragment key={index}>
            {part}
            {index < parts.length - 1 && <br />}
        </Fragment>
    ));

    const handleLikePost = () => {
        handleReact(blogid, { displayName: currentUserData.displayName, uid: currentUserData.uid, photoURL: currentUserData.photoURL });
        setLikePost((prev) => !prev);
    };

    const handleEdit = useCallback(() => {}, []);

    const handleDelete = async () => {
        await deleteDocument("blogs", blogid, getPathImage()).then(() => {});
    };

    return (
        <div className="p-3  border-t border-solid border-[#8a8a8a3f] flex">
            <div className="min-w-12 w-12 max-w-12 flex flex-col">
                <Link href={useURL}>
                    <div className="{style.modalCard}">
                        <Image src={avatar} width={36} height={36} alt="user" className="rounded-full w-9 h-9 object-cover cursor-pointer" />
                    </div>
                </Link>
                <div className="pt-2 w-9 flex justify-center h-full">
                    <div className="w-[1px] h-[calc(100%-12px)] bg-[#8a8a8a3f] relative after:absolute after:w-3 after:h-3 after:bg-[#8a8a8a3f] after:rounded-full after:top-full after:left-1/2 after:-translate-x-1/2"></div>
                </div>
            </div>
            <div className="flex-1 ">
                <div className="w-full flex justify-between h-5 mb-1.5">
                    <Link href={useURL} className="font-semibold hover:underline">
                        {username}
                    </Link>
                    <div className="flex items-center">
                        <div className="tetx-#[acacac] text-sm">{postTime}</div>
                        <>
                            {isAuthor ? (
                                <>my post</>
                            ) : // <Popover placement="bottom-end" isOpen={isPopoverOpen} onOpenChange={setPopoverOpen}>
                            //     <PopoverTrigger>
                            //         <Button variant="light" size="sm" radius="full" isIconOnly>
                            //             <SlOptions color="#444444" />
                            //         </Button>
                            //     </PopoverTrigger>
                            //     <PopoverContent>
                            //         <div className="px-1 py-2 flex flex-col items-start">
                            //             <Button onClick={handleEdit} className="w-full flex justify-start px-2 hover:!bg-transparent " variant="light">
                            //                 Edit post
                            //             </Button>

                            //             <Button
                            //                 onClick={() => setPopoverOpen(false)}
                            //                 onPress={onOpen}
                            //                 className="w-full flex justify-start px-2 hover:!bg-transparent text-red-600"
                            //                 variant="light"
                            //             >
                            //                 Delete post
                            //             </Button>
                            //         </div>
                            //     </PopoverContent>
                            // </Popover>
                            null}
                        </>
                    </div>
                </div>
                <div className="mb-2 font-normal">{elements}</div>
                <div className="w-full">
                    {imageSrc ? (
                        // <ViewPhoto photoURL={imageSrc}>
                        <Image priority style={{ width: "100%", height: "auto" }} src={imageSrc} width={600} height={300} alt="image" placeholder="empty" />
                    ) : // </ViewPhoto>
                    null}
                </div>
                <div className="mt-2.5 flex items-center">
                    <div className="w-9 h-9 mr-1">
                        <button className="flex items-center justify-center rounded-full w-full h-full bg-transparent text-2xl" onClick={handleLikePost}>
                            {likePost ? <Heart fill="red" color="red" /> : <Heart />}
                        </button>
                    </div>
                    <div className="w-9 h-9 mr-1">
                        <button className="flex items-center justify-center rounded-full w-full h-full bg-transparent text-2xl">
                            <MessageCircleMore />
                        </button>
                    </div>
                    <div className="w-9 h-9 mr-1">
                        <button className="flex items-center justify-center rounded-full w-full h-full bg-transparent text-2xl">
                            <Send />
                        </button>
                    </div>
                </div>
                <div className="mt-2.5 text-[#acacac] text-sm">{likedCount} lượt thích</div>
            </div>
        </div>
    );
};

export default Blog;
