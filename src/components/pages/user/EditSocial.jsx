"use client";
import { useState } from "react";
import { updateSocialLink } from "@/firebase/services";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import GmailIcon from "@/components/icons/GmailIcon";
import FacebookIcon from "@/components/icons/FacebookIcon";
import InstagramIcon from "@/components/icons/InstagramIcon";
import ThreadsIcon from "@/components/icons/ThreadsIcon";
import TikTokIcon from "@/components/icons/TikTokIcon";
import XIcon from "@/components/icons/XIcon";

const EditSocial = ({ authUserData, setAuthUserData }) => {
    const [openForm, setOpenForm] = useState(false);
    const [email, setEmail] = useState(authUserData?.email);
    const [facebook, setFacebook] = useState(authUserData?.facebook);
    const [instagram, setInstagram] = useState(authUserData?.instagram);
    const [threads, setThreads] = useState(authUserData?.threads);
    const [tiktok, setTikTok] = useState(authUserData?.tiktok);
    const [x, setX] = useState(authUserData?.x);
    const emailRegular = /[^@]{2,64}@[^.]{2,253}\.[0-9a-z-.]{2,63}/;

    const handleCancel = () => {
        setOpenForm(false);
        setEmail(authUserData?.email);
        setFacebook(authUserData?.facebook);
        setInstagram(authUserData?.instagram);
        setThreads(authUserData?.threads);
        setTikTok(authUserData?.tiktok);
        setX(authUserData?.x);
    };
    const handleEditSocial = async () => {
        let flag = 0;
        if (!emailRegular.test(email) && email) {
            flag = 1;
        } else if (
            facebook.includes("https://") ||
            instagram.includes("https://") ||
            threads.includes("https://") ||
            tiktok.includes("https://") ||
            x.includes("https://")
        ) {
            flag = 2;
        }

        if (flag == 1) {
            toast.error("Sai định dạng mail");
            setOpenForm(true);
            return;
        } else if (flag == 2) {
            toast.error("Chỉ nhập tên tài khoản");
            setOpenForm(true);
            return;
        }

        const res = await updateSocialLink(authUserData, email, facebook, instagram, threads, tiktok, x);
        if (res) {
            setAuthUserData(res);
            toast("Đã sửa thông tin");
            setOpenForm(false);
        } else {
            toast.error("Đã xảy ra lỗi !");
            setOpenForm(true);
        }
    };
    return (
        <div className="w-full ">
            {openForm ? (
                <div>
                    <div className="border-t border-border pt-4">
                        <div className="grid grid-cols-10 items-center gap-4 mb-4">
                            <Label htmlFor="email" className="text-start">
                                <GmailIcon width={23} height={23} />
                            </Label>
                            <Input
                                onChange={(e) => setEmail(e.target.value.trim())}
                                placeholder="example@gmail.com"
                                id="email"
                                value={email}
                                className="col-span-9 rounded-none text-base border-border"
                            />
                        </div>
                        <div className="grid grid-cols-10 items-center gap-4 mb-4">
                            <Label htmlFor="Facebook" className="text-start">
                                <FacebookIcon width={20} height={20} />
                            </Label>
                            <div className="col-span-9 flex items-center border border-border">
                                <Label htmlFor="Facebook" className="pl-4 pr-1 py-2 text-base">
                                    https://facebook.com/
                                </Label>
                                <Input
                                    onChange={(e) => setFacebook(e.target.value.trim())}
                                    placeholder="facebook ID"
                                    id="Facebook"
                                    value={facebook}
                                    className="w-full px-0 text-base border-none"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-10 items-center gap-4 mb-4">
                            <Label htmlFor="Instagram" className="text-start">
                                <InstagramIcon width={19} height={19} />
                            </Label>
                            <div className="col-span-9 flex items-center border border-border">
                                <Label htmlFor="Instagram" className="pl-4 pr-1 py-2 text-base">
                                    https://instagram.com/
                                </Label>
                                <Input
                                    onChange={(e) => setInstagram(e.target.value.trim())}
                                    placeholder="name"
                                    id="Instagram"
                                    value={instagram}
                                    className="w-full px-0 text-base border-none"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-10 items-center gap-4 mb-4">
                            <Label htmlFor="Threads" className="text-start">
                                <ThreadsIcon width={20} height={20} />
                            </Label>
                            <div className="col-span-9 flex items-center border border-border">
                                <Label htmlFor="Threads" className="pl-4 pr-1 py-2 text-base">
                                    https://threads.net/
                                </Label>
                                <Input
                                    onChange={(e) => setThreads(e.target.value.trim())}
                                    placeholder="@name"
                                    id="Threads"
                                    value={threads}
                                    className="w-full px-0 text-base border-none"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-10 items-center gap-4 mb-4">
                            <Label htmlFor="TikTok" className="text-start">
                                <TikTokIcon width={22} height={22} />
                            </Label>
                            <div className="col-span-9 flex items-center border border-border">
                                <Label htmlFor="TikTok" className="pl-4 pr-1 py-2 text-base">
                                    https://tiktok.com/
                                </Label>
                                <Input
                                    onChange={(e) => setTikTok(e.target.value.trim())}
                                    placeholder="@name"
                                    id="TikTok"
                                    value={tiktok}
                                    className="w-full px-0 text-base border-none"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-10 items-center gap-4 mb-4">
                            <Label htmlFor="X" className="text-start">
                                <XIcon width={22} height={22} />
                            </Label>

                            <div className="col-span-9 flex items-center border border-border">
                                <Label htmlFor="X" className="pl-4 pr-1 py-2 text-base">
                                    https://x.com/
                                </Label>
                                <Input onChange={(e) => setX(e.target.value.trim())} placeholder="name" id="X" value={x} className="w-full px-0 text-base border-none" />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-x-3">
                        <Button onClick={handleCancel} variant="outline" className="w-32  font-bold">
                            Hủy
                        </Button>
                        <Button onClick={handleEditSocial} variant="" className="w-32  font-bold">
                            Lưu
                        </Button>
                    </div>
                </div>
            ) : (
                <Button onClick={() => setOpenForm(true)} variant="" className="w-full font-bold">
                    Liên kết mạng xã hội
                </Button>
            )}
        </div>
    );
};

export default EditSocial;
