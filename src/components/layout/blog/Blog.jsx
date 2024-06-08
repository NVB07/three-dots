"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, Fragment, useCallback, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteDocument, handleLikeReact, getUser } from "@/firebase/services";

import NewBlog from "../newBlog/NewBlog";

import HeartIcon from "@/components/icons/HeartIcon";
import CommentIcon from "@/components/icons/CommentIcon";
import ShareIcon from "@/components/icons/ShareIcon";
import CloseIcon from "@/components/icons/CloseIcon";
import OptionIcon from "@/components/icons/OptionIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import CountReact from "./CountReact";

const Blog = ({
    blogDetails = false,
    blogid,
    authorid,
    currentUserData,
    liked,
    userURL = "/",
    imageSrc,
    postTime = "",
    content = "",
    likedCount = 0,
    authorUserData,
}) => {
    const isAuthor = currentUserData?.uid === authorid;
    const [likePost, setLikePost] = useState(liked ? true : false);
    const [openOption, setOpenOption] = useState();
    const [author, setAuthor] = useState();
    const router = useRouter();

    useEffect(() => {
        setLikePost(liked ? true : false);
    }, [liked]);

    useEffect(() => {
        if (authorUserData) {
            setAuthor(authorUserData);
            return;
        }

        const getUserData = async () => {
            const user = await getUser(authorid);
            setAuthor(user);
        };
        authorid && getUserData();
    }, [authorid]);

    const getPathImage = useCallback(() => {
        if (imageSrc) {
            const startIndex = imageSrc.lastIndexOf("/") + 1;
            const endIndex = imageSrc.indexOf("?alt=");
            const encodedImagePath = imageSrc.substring(startIndex, endIndex);

            return decodeURIComponent(encodedImagePath);
        }
        return null;
    }, []);

    const parts = content.split("|~n|");
    const elements = parts.map((part, index) => (
        <Fragment key={index}>
            {part}
            {index < parts.length - 1 && <br />}
        </Fragment>
    ));

    const handleLikePost = () => {
        handleLikeReact(currentUserData.uid, blogid, !likePost);
        setLikePost((prev) => !prev);
    };

    const handleDelete = async () => {
        await deleteDocument("blogs", blogid, getPathImage())
            .then(() => {
                toast("Đã xóa bài viết", {
                    cancel: {
                        label: <CloseIcon />,
                        onClick: () => {},
                    },
                    icon: <TrashIcon />,
                });
            })
            .catch(() => {
                toast.error("Lỗi khi xóa bài", {
                    action: {
                        label: <CloseIcon />,
                        onClick: () => {},
                    },
                });
            });
    };
    const handleCopyLink = () => {
        const currentUrl = new URL(window.location.href);
        const baseUrl = currentUrl.origin;
        navigator.clipboard
            .writeText(baseUrl + "/blog/" + blogid)
            .then(() => {
                toast("Đã sao chép liên kết bài viết", {
                    cancel: {
                        label: <CloseIcon />,
                        onClick: () => {},
                    },
                    icon: <TrashIcon />,
                });
            })
            .catch((err) => {
                toast.error("Lỗi khi sao chép liên kết", {
                    action: {
                        label: <CloseIcon />,
                        onClick: () => {},
                    },
                });
            });
    };

    const closeOption = () => {
        setOpenOption(false);
    };

    const viewBlog = () => {
        router.push("/blog/" + blogid);
    };

    const imageLoader = ({ src, width, quality }) => {
        return `/_next/image?url=${encodeURIComponent(imageSrc)}&w=${width}&q=${quality || 75}`;
    };

    return (
        <div className="p-3  border-t border-solid border-[#8a8a8a3f] flex">
            <div className="min-w-12 w-12 max-w-12 flex flex-col">
                <Link href={userURL}>
                    <div className="{style.modalCard}">
                        {author?.photoURL && (
                            <Image src={author.photoURL} width={36} height={36} alt="user" className="rounded-full w-9 h-9 object-cover cursor-pointer" />
                        )}
                    </div>
                </Link>
                <div className="pt-2 w-9 flex justify-center h-full">
                    <div className="w-[1px] h-[calc(100%-12px)] bg-[#8a8a8a3f] relative after:absolute after:w-3 after:h-3 after:bg-[#8a8a8a3f] after:rounded-full after:top-full after:left-1/2 after:-translate-x-1/2"></div>
                </div>
            </div>
            <div className="flex-1 ">
                <div className="w-full flex justify-between h-5 mb-1.5">
                    <div className=" flex items-end">
                        <Link href={userURL} className="font-semibold hover:underline">
                            {author?.displayName ? author.displayName : "username"}
                        </Link>
                        <div className="text-[#acacac] text-sm sm:text-base ml-4">{postTime}</div>
                    </div>
                    <div className="flex items-center">
                        <>
                            {isAuthor ? (
                                <Popover onOpenChange={setOpenOption} open={openOption}>
                                    <PopoverTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-full w-7 h-7">
                                            <OptionIcon width={20} height={20} />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full flex flex-col p-0">
                                        {!blogDetails ? (
                                            <Button onClick={viewBlog} variant="ghost" className="border-b border-solid border-[#8a8a8a3f] rounded-b-none">
                                                Xem bài viết
                                            </Button>
                                        ) : null}
                                        {/* //edit post */}
                                        <NewBlog
                                            onClick={closeOption}
                                            blogid={blogid}
                                            contentBlog={content.replace(/\|~n\|/g, "\n")}
                                            buttonTitle={"Sửa bài viết"}
                                            styleButton="w-full rounded-none border-b border-solid border-[#8a8a8a3f]"
                                        />

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" className="text-[#f14b5c] hover:text-[#f14b5c] rounded-t-none">
                                                    Xóa bài viết
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>bạn có muốn xóa bài viết này ?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Việc xóa bài viết sẽ không thể khôi phục trong tương lai.<br></br> Hãy cân nhắc trước khi xác nhận xóa.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                    <AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </PopoverContent>
                                </Popover>
                            ) : !blogDetails ? (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-full w-7 h-7">
                                            <OptionIcon width={20} height={20} />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full flex flex-col p-0">
                                        <Button onClick={viewBlog} variant="ghost" className="">
                                            Xem bài viết
                                        </Button>
                                    </PopoverContent>
                                </Popover>
                            ) : null}
                        </>
                    </div>
                </div>
                <div className="mb-2 text-[15px] ">{elements}</div>
                <div className="w-fit">
                    {imageSrc ? (
                        <Image
                            loader={imageLoader}
                            priority
                            style={{ width: "auto", height: "auto" }}
                            src={imageSrc}
                            width={600}
                            height={300}
                            alt="image"
                            blurDataURL="/next.svg"
                            placeholder="blur"
                            className="rounded"
                        />
                    ) : null}
                </div>
                <div className="mt-2.5 flex items-center">
                    <div className="w-9 h-9 mr-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="flex items-center justify-center rounded-full w-full h-full bg-transparent text-2xl p-1.5"
                            onClick={handleLikePost}
                        >
                            {likePost ? <HeartIcon solidColor="red" /> : <HeartIcon />}
                        </Button>
                    </div>
                    {!blogDetails && (
                        <div className="w-9 h-9 mr-1">
                            <Button
                                onClick={viewBlog}
                                variant="ghost"
                                size="icon"
                                className="flex items-center justify-center rounded-full w-full h-full bg-transparent text-2xl p-1.5"
                            >
                                <CommentIcon width={22} height={22} />
                            </Button>
                        </div>
                    )}
                    <div className="w-9 h-9 mr-1">
                        <Button
                            variant="ghost"
                            onClick={handleCopyLink}
                            size="icon"
                            className="flex items-center justify-center rounded-full w-full h-full bg-transparent text-2xl p-1"
                        >
                            <ShareIcon />
                        </Button>
                    </div>
                </div>
                <CountReact blogid={blogid} like={likedCount} />
            </div>
        </div>
    );
};

export default Blog;
