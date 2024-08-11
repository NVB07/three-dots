"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import PenIcon from "@/components/icons/PenIcon";
import { updateUserName } from "@/firebase/services";
import { toast } from "sonner";

const userName = ({ authUserData, isMyAccount, isLoading, setAuthUserData }) => {
    const [editAble, setEditAble] = useState(false);
    const [newName, setNewName] = useState(authUserData?.displayName);

    const editName = async () => {
        const res = await updateUserName(authUserData, newName);
        if (res) {
            setAuthUserData(res);
            toast.success("Đã sửa tên");
            setEditAble(false);
        } else {
            toast.error("Đã xảy ra lỗi !");
        }
    };

    const cancelEdit = () => {
        setNewName(authUserData?.displayName);
        setEditAble(false);
    };
    return (
        <div className="md:flex items-center">
            <div className="flex items-center">
                {!editAble ? (
                    <h3 className="text-xl font-bold">{isLoading ? <Skeleton className={"w-40 h-7 rounded-md"} /> : authUserData?.displayName}</h3>
                ) : (
                    <Input className=" text-xl font-bold px-1" defaultValue={authUserData?.displayName} onChange={(e) => setNewName(e.target.value.trim())} />
                )}
                {isMyAccount && !editAble && (
                    <Button onClick={() => setEditAble(true)} variant="ghost" className="rounded-full w-7 ml-4 h-7 p-0">
                        <PenIcon width={20} height={20} />
                    </Button>
                )}
            </div>
            {editAble && (
                <div className=" flex items-center gap-2 justify-end md:justify-start md:ml-2 mt-1 md:mt-0">
                    <Button onClick={cancelEdit} variant="outline" className=" ">
                        Hủy
                    </Button>
                    <Button disabled={newName === authUserData?.displayName || !newName} onClick={editName} variant="" className=" ">
                        Lưu
                    </Button>
                </div>
            )}
        </div>
    );
};

export default userName;
