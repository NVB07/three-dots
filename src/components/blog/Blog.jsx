"use client";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { useRouter } from "next13-progressbar";
import { useState, useCallback, useEffect, useContext } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Globe, Users } from "lucide-react";
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
import { handleLikeReact, deleteDocument } from "@/firebase/services";
// import useDeleteDoc from "@/customHook/useDeleteDoc";

import NewBlog from "../newBlog/NewBlog";

import HeartIcon from "@/components/icons/HeartIcon";
import CommentIcon from "@/components/icons/CommentIcon";
import ShareIcon from "@/components/icons/ShareIcon";
import CloseIcon from "@/components/icons/CloseIcon";
import OptionIcon from "@/components/icons/OptionIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import CountReact from "./CountReact";

import { fireStore } from "@/firebase/config";
import { onSnapshot, doc } from "firebase/firestore";
import { AuthContext } from "@/context/AuthProvider";
import DialogComment from "./DialogComment";
// import { useQuery } from "@tanstack/react-query";

const Blog = ({ blogDetails = false, blogid, authorid }) => {
    // const { data, error, isLoading } = useQuery({
    //     queryKey: ["blogData"],
    //     queryFn: getTodos,
    //     staleTime: Infinity,
    // });

    const { authUserData } = useContext(AuthContext);
    const [openOption, setOpenOption] = useState(); // Mở đóng dialog
    const [authorData, setAuthorData] = useState(); // dữ liệu cá nhân tác giả

    const [loading, setLoading] = useState(false);
    const [thisBlogData, setThisBlogData] = useState(); // dữ liệu blog
    const [likePost, setLikePost] = useState(false); // trạng thái like của người dùng hiện tại

    const router = useRouter();
    // const { deleteDocument } = useDeleteDoc();
    // định dạng thời gian
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

    // real time dữ liệu document(blog)
    useEffect(() => {
        if (blogid) {
            const unsub = onSnapshot(doc(fireStore, "blogs", blogid), (doc) => {
                const blogData = doc.data();
                setThisBlogData(blogData);
                setLikePost(
                    blogData?.liked?.find((uid) => {
                        return uid === authUserData?.uid;
                    })
                );
            });

            return () => unsub();
        }
    }, [blogid]);

    // real time dữ liệu tác giả
    useEffect(() => {
        if (authorid) {
            const unsub = onSnapshot(doc(fireStore, "users", authorid), (doc) => {
                const data = doc.data();
                setAuthorData(data);
            });

            return () => unsub();
        }
    }, [authorid]);

    // lấy đường dẫn ảnh của blog
    const getPathImage = () => {
        if (thisBlogData?.post.imageURL) {
            const startIndex = thisBlogData?.post.imageURL.lastIndexOf("/") + 1;
            const endIndex = thisBlogData?.post.imageURL.indexOf("?alt=");
            const encodedImagePath = thisBlogData?.post.imageURL.substring(startIndex, endIndex);

            return decodeURIComponent(encodedImagePath);
        }
        return null;
    };

    // xử lí like/unlike
    const handleLikePost = () => {
        handleLikeReact(authUserData?.uid, blogid, !likePost);
        setLikePost((prev) => !prev);
    };

    // xử lí xóa blog
    const handleDelete = async () => {
        setLoading(true);
        setOpenOption(false);
        const pathImage = getPathImage();
        const success = await deleteDocument("blogs", blogid, pathImage);
        if (success) {
            toast.success("Đã xóa bài viết");
        } else {
            toast.error("Lỗi khi xóa bài");
            setOpenOption();
            setLoading(false);
        }
        // .then(() => {
        //     toast.success("Đã xóa bài viết", {
        //         cancel: {
        //             label: <CloseIcon />,
        //             onClick: () => {},
        //         },
        //         icon: <TrashIcon />,
        //     });
        //     blogDetails && router.push("/");
        // })
        // .catch(() => {
        //     setOpenOption();
        //     setLoading(false);
        //     toast.error("Lỗi khi xóa bài");
        // });
        // const success = await deleteDocument("blogs", blogid, pathImage);
        // if (success) {
        //     toast.success("Đã xóa bài viết", {
        //         cancel: {
        //             label: <CloseIcon />,
        //             onClick: () => {},
        //         },
        //         icon: <TrashIcon />,
        //     });
        // } else {
        //     toast.error("Lỗi khi xóa bài", {
        //         action: {
        //             label: <CloseIcon />,
        //             onClick: () => {},
        //         },
        //     });
        //     setOpenOption();
        //     setLoading(false);
        // }
    };

    // xử lí sao chép liên kết blog
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

    // đóng dialog
    const closeOption = () => {
        setOpenOption(false);
    };

    // xem chi tiết blog (cmt)
    const viewBlog = () => {
        router.push("/blog/" + blogid);
    };

    // tối ưu ảnh blog
    const imageLoader = ({ src, width, quality }) => {
        return `/_next/image?url=${encodeURIComponent(thisBlogData?.post.imageURL)}&w=${width}&q=${quality || 75}`;
    };

    return (
        <div className="p-3  border-t border-solid border-[#8a8a8a3f] flex relative">
            {loading ? <Skeleton className="w-full absolute opacity-80 h-full rounded-md z-50 top-0 left-0"></Skeleton> : null}
            <div className="min-w-12 w-12 max-w-12 flex flex-col">
                <Link href={"/user/@" + authorData?.uid}>
                    <div className="{style.modalCard}">
                        {authorData?.photoURL ? (
                            <Image
                                src={authorData?.photoURL}
                                width={36}
                                height={36}
                                alt={"Ảnh đại diện của " + authorData?.displayName}
                                className="w-9 h-9 rounded-full "
                                quality={50}
                            />
                        ) : (
                            <Image
                                src={"/avatarDefault.svg"}
                                width={36}
                                height={36}
                                alt={"Ảnh đại diện của " + authorData?.displayName}
                                className="w-9 h-9 rounded-full "
                                quality={50}
                            />
                        )}
                    </div>
                </Link>
                <div className=" w-9 flex justify-center h-full">
                    <div className="w-[1px] h-[calc(100%-12px)] bg-[#8a8a8a3f] relative after:absolute after:w-3 after:h-3 after:bg-[#8a8a8a3f] after:rounded-full after:top-full after:left-1/2 after:-translate-x-1/2"></div>
                </div>
            </div>
            <div className="flex-1 ">
                <div className="w-full flex justify-between  mb-1.5">
                    <div className=" flex flex-col items-start">
                        <Link href={"/user/@" + authorData?.uid} className="font-semibold hover:underline">
                            {authorData?.displayName ? authorData?.displayName : <Skeleton className="h-5 mb-1 w-32 rounded-lg" />}
                        </Link>
                        <div className="text-[#acacac] text-xs flex items-center gap-1.5">
                            {thisBlogData?.privacyValue === "public" ? (
                                <Globe className="w-3.5 h-3.5 text-foreground" />
                            ) : (
                                <Users className="w-3.5 h-3.5 text-foreground" />
                            )}
                            {authorData && thisBlogData?.createAt ? handleConvertDate(thisBlogData?.createAt) : <Skeleton className="h-4  w-28 rounded-lg" />}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <>
                            {thisBlogData?.author.uid === authUserData?.uid ? (
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
                                            contentBlog={thisBlogData?.post.content}
                                            buttonTitle={"Sửa bài viết"}
                                            styleButton="w-full rounded-none border-b border-solid border-[#8a8a8a3f]"
                                            privacy={thisBlogData?.privacyValue}
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
                <div className="mb-2 text-[15px] ">
                    {authorData && thisBlogData ? (
                        <div
                            style={{ wordBreak: "break-word" }}
                            className="break-words max-w-full list-custom-text"
                            dangerouslySetInnerHTML={{ __html: thisBlogData?.post.content }}
                        />
                    ) : (
                        thisBlogData?.post.content && <Skeleton className="w-full h-5" />
                    )}
                </div>

                <div className="w-full h-fit ">
                    {authorData && thisBlogData?.post.imageURL ? (
                        <Image
                            loader={imageLoader}
                            priority
                            style={{ width: "auto", height: "auto", maxHeight: "384px" }}
                            src={thisBlogData?.post.imageURL}
                            width={600}
                            height={300}
                            alt="image"
                            blurDataURL="/blur.png"
                            placeholder="blur"
                            className="rounded"
                        />
                    ) : (
                        thisBlogData?.post.imageURL && <Skeleton className="w-full h-80 rounded" />
                    )}
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
                            <DialogComment
                                thisBlogData={thisBlogData}
                                authorData={authorData}
                                handleCopyLink={handleCopyLink}
                                handleLikePost={handleLikePost}
                                blogid={blogid}
                                imageLoader={imageLoader}
                                likePost={likePost}
                                authCurrentUser={authUserData}
                            >
                                <Button variant="ghost" className="flex items-center justify-center rounded-full w-full h-full bg-transparent text-2xl p-1.5">
                                    <CommentIcon width={22} height={22} />
                                </Button>
                            </DialogComment>
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
                <CountReact
                    blogid={blogid}
                    like={thisBlogData?.liked?.length || 0}
                    thisBlogData={thisBlogData}
                    authorData={authorData}
                    handleCopyLink={handleCopyLink}
                    handleLikePost={handleLikePost}
                    imageLoader={imageLoader}
                    likePost={likePost}
                    authCurrentUser={authUserData}
                />
            </div>
        </div>
    );
};

export default Blog;
