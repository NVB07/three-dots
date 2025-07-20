"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import PenIcon from "@/components/icons/PenIcon";
import { updateUserName } from "@/firebase/services";
import { toast } from "sonner";

const UserName = ({ authUserData, isMyAccount, isLoading, setAuthUserData, userData }) => {
    const [editAble, setEditAble] = useState(false);
    const [newName, setNewName] = useState(authUserData?.displayName);
    const inputRef = useRef();

    const handleEdit = () => {
        setEditAble(true);
    };
    useEffect(() => {
        if (editAble && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editAble]);

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
                    <h3 className="text-xl font-bold">{isLoading ? <Skeleton className={"w-40 h-7 rounded-md"} /> : userData?.displayName}</h3>
                ) : (
                    <Input
                        maxLength={25}
                        ref={inputRef}
                        className=" text-lg font-bold px-0 py-0 border-x-0 border-t-0 rounded-none border-b border-b-slate-400 h-fit"
                        defaultValue={authUserData?.displayName}
                        onChange={(e) => setNewName(e.target.value.trim())}
                    />
                )}
                {isMyAccount && !editAble && (
                    <Button onClick={handleEdit} variant="ghost" className="rounded-full w-7 ml-4 h-7 p-0">
                        <PenIcon width={20} height={20} />
                    </Button>
                )}
            </div>
            {editAble && (
                <div className=" flex items-center gap-2 justify-end md:justify-start md:ml-2 mt-1 md:mt-0">
                    <Button onClick={cancelEdit} variant="outline" className="py-0 h-[30px] ">
                        Hủy
                    </Button>
                    <Button disabled={newName === authUserData?.displayName || !newName} onClick={editName} variant="" className="py-0 h-[30px] ">
                        Lưu
                    </Button>
                </div>
            )}
        </div>
    );
};

export default UserName;
