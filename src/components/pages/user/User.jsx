"use client";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState, memo, useCallback } from "react";
import { collection, query, onSnapshot, orderBy, where } from "firebase/firestore";
import { addDocument, updateUserProfile, getUser } from "@/firebase/services";
import { fireStore } from "@/firebase/config";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import CloseIcon from "@/components/icons/CloseIcon";
import CheckIcon from "@/components/icons/CheckIcon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Blog from "../../layout/blog/Blog";
import { AuthContext } from "@/auth/AuthProvider";

const User = ({ param }) => {
    const [userData, setUserData] = useState();
    const authUserData = useContext(AuthContext);

    const [isMyAccount, setIsMyAccount] = useState(false);
    const [posts, setPosts] = useState([]);
    const [newName, setNewName] = useState(authUserData?.displayName);
    const [newAvatar, setNewAvatar] = useState();
    const [openOption, setOpenOption] = useState();

    const router = useRouter();
    const pathname = usePathname();
    useEffect(() => {
        if (pathname !== "/user/@" + authUserData.uid) {
            setIsMyAccount(false);
        } else {
            setIsMyAccount(true);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = async () => {
            const data = await getUser(param.replace("%40", ""));
            setUserData(data);
        };

        unsubscribe();
    }, []);

    const handleChat = async () => {
        if (authUserData && userData) {
            onSnapshot(collection(fireStore, "roomsChat"), (snapshot) => {
                const docsArray = [];
                snapshot.forEach((doc) => {
                    docsArray.push({
                        id: doc.id,
                        ...doc.data(),
                    });
                });

                const resultId = docsArray.find((item) => {
                    const uids = item.user.map((user) => user.uid);
                    return uids.includes(userData.uid) && uids.includes(authUserData.uid);
                });

                if (resultId) {
                    router.push("/chat/" + resultId.id);
                } else {
                    try {
                        const addChat = async () => {
                            const documentID = await addDocument("roomsChat", {
                                user: [
                                    {
                                        name: authUserData.displayName || "",
                                        uid: authUserData.uid || "",
                                        photoURL: authUserData.photoURL || "",
                                    },
                                    {
                                        name: userData.displayName || "",
                                        uid: userData.uid || "",
                                        photoURL: userData.photoURL || "",
                                    },
                                ],
                            });
                            router.push("/chat/" + documentID);
                        };
                        addChat();
                    } catch (error) {
                        console.error("Error adding document:", error);
                    }
                }
            });
        } else {
            console.error("authUserData or userData is undefined");
        }
    };

    const handleConvertDate = useCallback((timestamp) => {
        if (timestamp) {
            const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);

            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const time = `${hours}:${minutes} | ${day}/${month}/${year}`;

            return time;
        }
        return "?";
    }, []);

    useEffect(() => {
        const q = query(collection(fireStore, "blogs"), where("author.uid", "==", param.replace("%40", "")), orderBy("createAt", "asc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.docChanges().forEach((change) => {
                const doc = change.doc;
                const blogData = { data: doc.data(), id: doc.id };
                switch (change.type) {
                    case "added":
                        setPosts((prevPosts) => [blogData, ...prevPosts]);
                        break;
                    case "modified":
                        setPosts((prevPosts) => prevPosts.map((post) => (post.id === doc.id ? blogData : post)));
                        break;
                    case "removed":
                        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== doc.id));
                        break;
                    default:
                        break;
                }
            });
        });
        return () => unsubscribe();
    }, []);
    if (!authUserData) {
        router.push("/login");
        return;
    }

    const selectImage = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            setNewAvatar({ reader: reader, name: file.name });
            reader.readAsDataURL(file);
        }
    };
    const handleCloseModal = () => {
        setNewName(authUserData?.displayName);
        setNewAvatar();
        setOpenOption();
    };

    const saveInformation = async () => {
        setOpenOption();
        const update = await updateUserProfile(newName, newAvatar);
        if (update) {
            toast("Đã sửa thông tin", {
                cancel: {
                    label: <CloseIcon />,
                    onClick: () => {},
                },
                icon: <CheckIcon />,
            });
            window.location.reload();
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
        <div className="w-full ">
            <div className="px-3 sm:px-0">
                <div className="full flex items-start mb-6">
                    <div className="w-1/2">
                        <h3 className="text-xl font-bold">{userData?.displayName}</h3>
                        <h2 className="text-sm italic mt-2">{userData?.email}</h2>
                    </div>
                    <div className="w-1/2 flex justify-end">
                        {userData && (
                            <Image width={80} height={80} className="rounded-full" placeholder="blur" blurDataURL="/next.svg" src={userData?.photoURL} alt="avt" />
                        )}
                    </div>
                </div>
                {isMyAccount ? (
                    // <Button variant="secondary" onClick={editInfomation} className="w-full font-bold">
                    //     Sửa thông tin
                    // </Button>
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
                            <div className="flex flex-col py-4">
                                <div className="grid grid-cols-4 items-center gap-4 mb-4">
                                    <Label htmlFor="name" className="text-right">
                                        Tên
                                    </Label>
                                    <Input onChange={(e) => setNewName(e.target.value)} id="name" defaultValue={newName} className="col-span-3 text-base" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4 mb-4">
                                    <Label className="text-right">Avatar</Label>
                                    <input onChange={selectImage} type="file" id="avatar" placeholder="file" className="col-span-3" />
                                </div>

                                {/* <div className="grid grid-cols-4 items-center gap-4 mb-4">
                                    <Label htmlFor="email" className="text-right">
                                        Email
                                    </Label>
                                    <Input onChange={(e) => setNewEmail(e.target.value)} id="email" defaultValue={newEmail} className="col-span-3 text-base" />
                                </div> */}
                            </div>
                            <DialogFooter>
                                <Button
                                    disabled={
                                        (newName !== userData?.displayName && newAvatar) || (newName.trim() !== "" && newName !== userData?.displayName) || newAvatar
                                            ? false
                                            : true
                                    }
                                    onClick={saveInformation}
                                >
                                    Lưu thay đổi
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                ) : (
                    <Button onClick={handleChat} variant="" className="w-full font-bold">
                        Nhắn tin
                    </Button>
                )}
                <div className="w-full mt-5  p-1 font-semibold">{isMyAccount ? "Bài viết của tôi" : "Bài viết của " + userData?.displayName}</div>
            </div>
            <div className="mt-2">
                {posts.map((post) => {
                    return (
                        <MemoizedBlogs
                            key={post.id}
                            currentUserData={authUserData}
                            blogid={post.id}
                            authorid={post?.data.author.uid}
                            liked={post?.data.liked?.find((uid) => {
                                return uid === authUserData?.uid;
                            })}
                            authorUserData={userData}
                            useURL={"/user/@" + post?.data.author.uid}
                            avatar={post?.data.author.photoURL}
                            username={post?.data.author.displayName}
                            postTime={handleConvertDate(post?.data.createAt)}
                            content={post?.data.post.content}
                            imageSrc={post?.data.post.imageURL}
                            likedCount={post?.data.liked?.length}
                        />
                    );
                })}
            </div>
        </div>
    );
};
const MemoizedBlogs = memo(Blog);
export default User;
