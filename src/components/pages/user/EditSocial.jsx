"use client";
import { useState, useEffect } from "react";
import { updateSocialLink } from "@/firebase/services";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const EditSocial = ({ authUserData, setAuthUserData }) => {
    const [openForm, setOpenForm] = useState(false);
    const [email, setEmail] = useState(authUserData?.email);
    const [facebook, setFacebook] = useState(authUserData?.facebook);
    const [instagram, setInstagram] = useState(authUserData?.instagram);
    const [threads, setThreads] = useState(authUserData?.threads);
    const [tiktok, setTikTok] = useState(authUserData?.tiktok);
    const [x, setX] = useState(authUserData?.x);

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
        <div className="w-full">
            {openForm ? (
                <div>
                    <div>
                        <div className="grid grid-cols-10 items-center gap-4 mb-4">
                            <Label htmlFor="email" className="text-start">
                                Em
                            </Label>
                            <Input onChange={(e) => setEmail(e.target.value)} placeholder="example@gmail.com" id="email" value={email} className="col-span-9 text-base" />
                        </div>
                        <div className="grid grid-cols-10 items-center gap-4 mb-4">
                            <Label htmlFor="Facebook" className="text-start">
                                Fa
                            </Label>
                            <Input
                                onChange={(e) => setFacebook(e.target.value)}
                                placeholder="https://facebook.com/exampleName"
                                id="Facebook"
                                value={facebook}
                                className="col-span-9 text-base"
                            />
                        </div>
                        <div className="grid grid-cols-10 items-center gap-4 mb-4">
                            <Label htmlFor="Instagram" className="text-start">
                                In
                            </Label>
                            <Input
                                onChange={(e) => setInstagram(e.target.value)}
                                placeholder="Tên tài khoản"
                                id="Instagram"
                                value={instagram}
                                className="col-span-9 text-base"
                            />
                        </div>
                        <div className="grid grid-cols-10 items-center gap-4 mb-4">
                            <Label htmlFor="Threads" className="text-start">
                                Th
                            </Label>
                            <Input
                                onChange={(e) => setThreads(e.target.value)}
                                placeholder="Tên tài khoản"
                                id="Threads"
                                value={threads}
                                className="col-span-9 text-base"
                            />
                        </div>
                        <div className="grid grid-cols-10 items-center gap-4 mb-4">
                            <Label htmlFor="TikTok" className="text-start">
                                Ti
                            </Label>
                            <Input onChange={(e) => setTikTok(e.target.value)} placeholder="Tên tài khoản" id="TikTok" value={tiktok} className="col-span-9 text-base" />
                        </div>
                        <div className="grid grid-cols-10 items-center gap-4 mb-4">
                            <Label htmlFor="X" className="text-start">
                                X
                            </Label>
                            <Input onChange={(e) => setX(e.target.value)} placeholder="Tên tài khoản" id="X" value={x} className="col-span-9 text-base" />
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-x-3">
                        <Button onClick={handleCancel} variant="" className="w-32  font-bold">
                            close
                        </Button>
                        <Button onClick={handleEditSocial} variant="" className="w-32  font-bold">
                            save
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
