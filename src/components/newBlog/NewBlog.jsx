"use client";
import Image from "next/image";
import { toast } from "sonner";
import { useContext, useState, useRef, useCallback, useEffect } from "react";

import { Dialog, DialogContent, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { AuthContext } from "@/context/AuthProvider";
import { addDocument, addFileToStorage, updateContent } from "@/firebase/services";

import ImageAddIcon from "@/components/icons/ImageAddIcon";
import CloseIcon from "@/components/icons/CloseIcon";
import CheckIcon from "@/components/icons/CheckIcon";
import TextEditor from "../textEditor/TextEditor";

const NewBlog = ({ buttonTitle, styleButton = "", blogid, contentBlog = "", onClick }) => {
    const { authUserData } = useContext(AuthContext);
    const inputImageRef = useRef();
    const imagePreviewRef = useRef();
    const [dialogNewBlog, setDialogNewBlog] = useState();
    const [previewImageState, setPreviewImageState] = useState(false);
    const [imageFile, setImageFile] = useState();
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState(blogid ? contentBlog : "");
    const [plainText, setPlainText] = useState("");

    const textareaRef = useRef(null);
    const openTextArea = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.scrollTop = textarea.scrollHeight;
            textarea.style.height = textarea.scrollHeight + "px";
            textarea.setSelectionRange(textarea.value.length, textarea.value.length);
        }
    };
    const handleSelectImage = useCallback(() => {
        inputImageRef.current.click();
    }, []);
    const handleRemoveImage = useCallback(() => {
        if (inputImageRef.current && inputImageRef.current.value) {
            setPreviewImageState(false);
            inputImageRef.current.value = null;
            setImageFile(null);
        }
    }, []);

    const handleCloseModal = () => {
        setDialogNewBlog();
        handleRemoveImage();
        setImageFile(null);
        setPreviewImageState(false);
    };
    const handleRefresh = () => {
        setDialogNewBlog();
        setContent("");
        setPlainText("");
        handleRemoveImage();
        setImageFile(null);
        setPreviewImageState(false);
    };

    const previewImage = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (imagePreviewRef.current) {
                    imagePreviewRef.current.src = reader.result;
                    imagePreviewRef.current.style.display = "block";
                }
            };
            setImageFile({ reader: reader, name: file.name });
            reader.readAsDataURL(file);
            setPreviewImageState(true);
        }
    };

    const handleEditPostContent = async () => {
        setLoading(true);
        const searchKeywords = plainText
            .trim()
            .toUpperCase()
            .split(/[ \n]+/);
        await updateContent(blogid, content, searchKeywords, plainText.trim()).then(() => {
            setLoading(false);
            onClick();
            setDialogNewBlog(false);
            toast("Đã sửa bài viết", {
                description: plainText.trim().length < 40 ? `${plainText.trim()}` : `${plainText.trim().slice(0, 40)}...`,
                cancel: {
                    label: <CloseIcon />,
                    onClick: () => {},
                },
                icon: <CheckIcon />,
            });
        });
    };

    const handleNewPost = async () => {
        setLoading(true);
        const searchKeywords = plainText
            .trim()
            .toUpperCase()
            .split(/[ \n]+/);
        await addDocument("blogs", {
            author: {
                uid: authUserData?.uid,
            },
            post: {
                normalText: plainText.trim(),
                content: content,
                searchKeywords: searchKeywords,
                imageURL: imageFile ? await addFileToStorage(imageFile.reader?.result, "imagePostBlogs/", imageFile.name) : "",
            },
        })
            .then(() => {
                setLoading(false);
                setDialogNewBlog(false);
                toast.success("Đã đăng bài viết", {
                    description: plainText.trim().length < 40 ? `${plainText.trim()}` : `${plainText.trim().slice(0, 40)}...`,
                    cancel: {
                        label: <CloseIcon />,
                        onClick: () => {},
                    },
                    icon: <CheckIcon />,
                });
            })
            .catch(() => {
                toast.error("Lỗi !", {
                    description: plainText.trim().length < 40 ? `${plainText.trim()}` : `${plainText.trim().slice(0, 40)}...`,
                    cancel: {
                        label: <CloseIcon />,
                        onClick: () => {},
                    },
                });
            });
    };
    return (
        <Dialog onOpenChange={!blogid ? handleRefresh : handleCloseModal} open={dialogNewBlog}>
            <DialogTrigger asChild>
                <Button onClick={() => setDialogNewBlog(true)} className={styleButton} variant="ghost">
                    {buttonTitle}
                </Button>
            </DialogTrigger>
            <DialogContent onOpenAutoFocus={openTextArea} className="min-w-80 max-w-[550px] w-full top-0 translate-y-0 sm:translate-y-[-50%] sm:top-[50%] ">
                <div className="flex">
                    <div className="w-10 mr-3 flex flex-col items-center">
                        {authUserData?.photoURL ? (
                            <Image
                                src={authUserData?.photoURL}
                                width={40}
                                height={40}
                                alt="avatar"
                                quality={60}
                                className="rounded-full border-border border border-solid w-10 h-10 "
                            />
                        ) : (
                            <Skeleton className="h-10 w-10 rounded-full" />
                        )}
                        <div className="w-[1px] h-full bg-[#8a8a8a3f] relative after:absolute after:rounded-full after:left-1/2 after:-translate-x-1/2 after:w-[11px] after:h-[11px] after:bg-[#8a8a8a3f] after:top-full"></div>
                    </div>
                    <div className="flex-1">
                        <p className="text-base font-semibold">{authUserData?.displayName}</p>
                        {/* <ScrollArea className="sm:max-h-[400px] max-h-[300px] p-2">
                            <TextEditor content={content} setContent={setContent} setPlainText={setPlainText} />
                            {previewImageState ? (
                                <div className="w-full max-w-[300px] pt-3 pr-3 relative">
                                    <Button onClick={handleRemoveImage} variant="secondary" className="rounded-full w-8 h-8 p-1.5 mt-2 absolute top-0 right-0">
                                        <CloseIcon />
                                    </Button>
                                    <img className="w-full h-auto rounded" src="#" alt="preview-image" ref={imagePreviewRef} />
                                </div>
                            ) : null}
                            {!blogid && (
                                <Button onClick={handleSelectImage} variant="ghost" className="rounded-full w-8 h-8 p-1.5 mt-2">
                                    <ImageAddIcon />
                                </Button>
                            )}
                            <input ref={inputImageRef} type="file" accept="image/*" hidden onChange={previewImage} />
                        </ScrollArea> */}
                        <div className="sm:max-h-[400px] max-h-[300px] overflow-auto p-2">
                            <TextEditor content={content} setContent={setContent} setPlainText={setPlainText} />
                            {previewImageState ? (
                                <div className="w-full max-w-[300px] pt-3 pr-3 relative">
                                    <Button onClick={handleRemoveImage} variant="secondary" className="rounded-full w-8 h-8 p-1.5 mt-2 absolute top-0 right-0">
                                        <CloseIcon />
                                    </Button>
                                    <img className="w-full h-auto rounded" src="#" alt="preview-image" ref={imagePreviewRef} />
                                </div>
                            ) : null}
                            {!blogid && (
                                <Button onClick={handleSelectImage} variant="ghost" className="rounded-full w-8 h-8 p-1.5 mt-2">
                                    <ImageAddIcon />
                                </Button>
                            )}
                            <input ref={inputImageRef} type="file" accept="image/*" hidden onChange={previewImage} />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={!blogid ? handleNewPost : handleEditPostContent}
                        disabled={loading || (!plainText.trim() && !imageFile)}
                        className="select-none"
                        type="submit"
                    >
                        {loading ? "Chờ..." : blogid ? "Sửa" : "Đăng"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default NewBlog;
