"use client";
import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import CloseIcon from "@/components/icons/CloseIcon";
import CheckIcon from "@/components/icons/CheckIcon";
import { updateInformation } from "@/firebase/services";

const EditProfile = ({ authUserData, setAuthUserData }) => {
    const [newName, setNewName] = useState(authUserData.displayName);
    const [newEmail, setNewEmail] = useState(authUserData.email);
    const [newFacebook, setNewFacebook] = useState(authUserData.facebook);
    const [newInstagram, setNewInstagram] = useState(authUserData.instagram);
    const [newThreads, setNewThreads] = useState(authUserData.threads);
    const [newTikTok, setNewTikTok] = useState(authUserData.tiktok);
    const [newX, setNewX] = useState(authUserData.x);
    const [newPhoto, setNewPhoto] = useState();
    const [currentPhotoURL, setCurrentPhotoURL] = useState(authUserData.photoURL);
    const [openOption, setOpenOption] = useState();

    const selectImage = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            setNewPhoto({ reader: reader, name: file.name });
            reader.readAsDataURL(file);
        }
    };

    // const getPathImage = useCallback(() => {
    //     if (newPhoto !==authUserData.photoURL) {
    //         const imageSrc = authUserData.photoURL;
    //         if (imageSrc) {
    //             const startIndex = imageSrc.lastIndexOf("/") + 1;
    //             const endIndex = imageSrc.indexOf("?alt=");
    //             const encodedImagePath = imageSrc.substring(startIndex, endIndex);

    //             return decodeURIComponent(encodedImagePath);
    //         }
    //     }
    //     return null;
    // }, [authUserData.photoURL]);

    const handleCloseModal = () => {
        setNewName(authUserData.displayName);
        setNewEmail(authUserData.email);
        setNewPhoto();
        setOpenOption();
    };

    const saveInformation = async () => {
        setOpenOption(false);
        const res = await updateInformation(authUserData.uid, newName, newEmail, newPhoto, currentPhotoURL);
        if (res) {
            setAuthUserData(res);
            setCurrentPhotoURL(res.photoURL);
            toast("Đã sửa thông tin", {
                cancel: {
                    label: <CloseIcon />,
                    onClick: () => {},
                },
                icon: <CheckIcon />,
            });
        } else {
            toast.error("Đã xảy ra lỗi !", {
                action: {
                    label: <CloseIcon />,
                    onClick: () => {},
                },
            });
        }
    };

    return (
        <Dialog onOpenChange={handleCloseModal} open={openOption}>
            <DialogTrigger asChild>
                <Button variant="secondary" onClick={() => setOpenOption(true)} className="w-full font-bold">
                    Sửa thông tin
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Sửa thông tin</DialogTitle>
                    {/* <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription> */}
                </DialogHeader>
                <div className="flex flex-col py-4 h-[1000px]">
                    <div className="grid grid-cols-4 items-center gap-4 mb-4">
                        <Label htmlFor="newname" className="text-right">
                            Tên
                        </Label>
                        <Input onChange={(e) => setNewName(e.target.value)} placeholder="Nhập tên mới" id="newname" value={newName} className="col-span-3 text-base" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4 mb-4">
                        <Label className="text-right">Avatar</Label>
                        <input onChange={selectImage} accept="image/*" type="file" id="avatar" placeholder="file" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4 mb-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="example@gmail.com"
                            id="email"
                            value={newEmail}
                            className="col-span-3 text-base"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4 mb-4">
                        <Label htmlFor="Facebook" className="text-right">
                            Facebook
                        </Label>
                        <Input
                            onChange={(e) => setNewFacebook(e.target.value)}
                            placeholder="Tên tài khoản"
                            id="Facebook"
                            value={newFacebook}
                            className="col-span-3 text-base"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4 mb-4">
                        <Label htmlFor="Instagram" className="text-right">
                            Instagram
                        </Label>
                        <Input
                            onChange={(e) => setNewInstagram(e.target.value)}
                            placeholder="Tên tài khoản"
                            id="Instagram"
                            value={newInstagram}
                            className="col-span-3 text-base"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4 mb-4">
                        <Label htmlFor="Threads" className="text-right">
                            Threads
                        </Label>
                        <Input
                            onChange={(e) => setNewThreads(e.target.value)}
                            placeholder="Tên tài khoản"
                            id="Threads"
                            value={newThreads}
                            className="col-span-3 text-base"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4 mb-4">
                        <Label htmlFor="TikTok" className="text-right">
                            TikTok
                        </Label>
                        <Input
                            onChange={(e) => setNewTikTok(e.target.value)}
                            placeholder="Tên tài khoản"
                            id="TikTok"
                            value={newTikTok}
                            className="col-span-3 text-base"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4 mb-4">
                        <Label htmlFor="X" className="text-right">
                            X
                        </Label>
                        <Input onChange={(e) => setNewX(e.target.value)} placeholder="Tên tài khoản" id="X" value={newX} className="col-span-3 text-base" />
                    </div>
                </div>
                <DialogFooter>
                    <Button disabled={newName === ""} onClick={saveInformation}>
                        Lưu thay đổi
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditProfile;
