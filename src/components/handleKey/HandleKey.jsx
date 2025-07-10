"use client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";

import { useEffect, useState } from "react";
import NodeRSA from "node-rsa";
import aesjs from "aes-js";
import sha256 from "js-sha256";
import Loading from "@/components/pages/loading/Loading";
import Cookies from "js-cookie";
import { getDocument, addPrivateKey, addPublicKey, deleteDocument } from "@/firebase/services";

const HandleKey = ({ setPrivateKey, uid }) => {
    const [passwordEncrypt, setPasswordEncrypt] = useState("");
    const [rePasswordEncrypt, setRePasswordEncrypt] = useState("");
    const [matchPassLevel, setMatchPassLevel] = useState(0);
    const [createPass, setCreatePass] = useState(0);
    const [keyDecrypt, setKeyDecrypt] = useState("");

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    const getSha256Bytes = (text) => {
        const hashHex = sha256(text);
        const bytes = [];
        for (let i = 0; i < hashHex.length; i += 2) {
            bytes.push(parseInt(hashHex.substr(i, 2), 16));
        }
        return Uint8Array.from(bytes);
    };

    useEffect(() => {
        if (!passwordEncrypt && !rePasswordEncrypt) {
            setMatchPassLevel(0);
        } else if (passwordEncrypt && rePasswordEncrypt && passwordEncrypt !== rePasswordEncrypt) {
            setMatchPassLevel(2);
        } else if (!passwordRegex.test(passwordEncrypt)) {
            setMatchPassLevel(3);
        } else {
            setMatchPassLevel(1);
        }
    }, [passwordEncrypt, rePasswordEncrypt]);

    useEffect(() => {
        const fetchKey = async () => {
            const docSnap = await getDocument("secretKeyEncrypted", uid);
            if (docSnap) {
                const encryptedKey = docSnap.data()?.key;
                console.log(encryptedKey);
                setCreatePass(1);
            } else {
                setCreatePass(2);
            }
        };
        fetchKey();
    }, []);

    const genKey = () => {
        const key = new NodeRSA({ b: 2048 });
        const publicKey = key.exportKey("public");
        const privateKey = key.exportKey("private");
        return { publicKey, privateKey };
    };

    const encryptAES = (plainText, key) => {
        const iv = aesjs.utils.hex.toBytes("b61ade79da2db1bca782ec9e9ef6a76e");
        const messageBytes = aesjs.utils.utf8.toBytes(plainText);
        const paddedMessage = aesjs.padding.pkcs7.pad(messageBytes);
        const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
        const encryptedBytes = aesCbc.encrypt(paddedMessage);
        const encryptedBase64 = btoa(String.fromCharCode(...encryptedBytes));

        return encryptedBase64;
    };

    const getKeyAndDecrypt = async () => {
        try {
            const docSnap = await getDocument("secretKeyEncrypted", uid);
            if (docSnap.exists()) {
                const encryptedKey = docSnap.data().key;

                const keyBytes = getSha256Bytes(keyDecrypt);

                const iv = aesjs.utils.hex.toBytes("b61ade79da2db1bca782ec9e9ef6a76e");
                const encryptedBytes = Uint8Array.from(atob(encryptedKey), (c) => c.charCodeAt(0));

                const aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, iv);
                const decryptedBytes = aesCbc.decrypt(encryptedBytes);
                const unpadded = aesjs.padding.pkcs7.strip(decryptedBytes);
                const decryptedText = aesjs.utils.utf8.fromBytes(unpadded);
                Cookies.set("privateKey", decryptedText, { expires: 180 });
                setPrivateKey(decryptedText);
            } else {
                console.error("Không tìm thấy khóa!");
            }
        } catch (error) {
            console.error("Lỗi khi giải mã khóa:", error);
            toast.error("Sai mật khẩu hoặc dữ liệu không hợp lệ.");
        }
    };

    // Xử lý nhập lại mật khẩu
    const checkRePassWord = (e) => {
        setRePasswordEncrypt(e.target.value);
    };

    // Xử lý nhập mật khẩu mới
    const handlePasswordEncrypt = (e) => {
        setPasswordEncrypt(e.target.value);
    };

    // Khi nhấn xác nhận, kiểm tra lại lần cuối
    const handleCreatePass = async () => {
        if (matchPassLevel === 1) {
            const keyBytes = getSha256Bytes(rePasswordEncrypt);
            console.log(keyBytes);
            const rsaKey = genKey();
            const encryptedKey = encryptAES(rsaKey.privateKey, keyBytes);
            Cookies.set("privateKey", rsaKey.privateKey, { expires: 180 });
            console.log(encryptedKey);
            await addPrivateKey(uid, encryptedKey, uid);
            await addPublicKey(uid, rsaKey.publicKey);
            window.location.reload();
        } else if (matchPassLevel === 2) {
            toast.error("Mật khẩu không khớp!");
        } else if (matchPassLevel === 3) {
            toast.error("Mật khẩu phải tối thiểu 6 ký tự, bao gồm chữ và số!");
        } else {
            toast.error("Vui lòng nhập đầy đủ thông tin!");
        }
    };

    // Hàm xử lý tạo mới mật khẩu
    const handleResetPasswordKey = () => {
        setPasswordEncrypt("");
        setRePasswordEncrypt("");
        setMatchPassLevel(0);
        setCreatePass(2); // chuyển về giao diện tạo mật khẩu mới
    };

    return (
        <div className="w-full h-screen flex justify-center items-center bg-white dark:bg-gray-900 transition-colors">
            {createPass === 2 && (
                <div className="w-full h-screen flex justify-center items-center">
                    <div className="max-w-[400px] w-full border border-gray-400 dark:border-gray-700 rounded-md shadow p-5 bg-white dark:bg-gray-800 transition-colors">
                        <p className="text-xl font-semibold text-red-600 dark:text-red-400">Tạo mật khẩu khóa bảo mật</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                            *Mật mã này để bảo mật và đồng bộ tin nhắn của bạn. Hãy sao lưu và giữ nó một cách an toàn. Nếu bạn quên mật khẩu này, sẽ không thể khôi phục
                            tin nhắn trong tương lai !
                        </p>
                        <Input
                            placeholder="Mật khẩu mới"
                            type="password"
                            className="mt-2 rounded-md border-gray-400 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white focus:border-purple-500 focus:dark:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 transition-colors"
                            value={passwordEncrypt}
                            onChange={handlePasswordEncrypt}
                        />
                        <Input
                            placeholder="Nhập lại mật khẩu"
                            type="password"
                            className="mt-2 rounded-md border-gray-400 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white focus:border-purple-500 focus:dark:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 transition-colors"
                            value={rePasswordEncrypt}
                            onChange={checkRePassWord}
                        />
                        <div className="px-1 h-4 pt-0.5 mb-4 min-h-[20px]">
                            {matchPassLevel === 2 && <p className="text-red-600 dark:text-red-400 text-xs italic">Mật khẩu không khớp</p>}
                            {matchPassLevel === 3 && <p className="text-red-600 dark:text-red-400 text-xs italic">Mật khẩu phải tối thiểu 6 ký tự, bao gồm chữ và số</p>}
                        </div>
                        <Button
                            className="w-full mt-2 rounded-md bg-red-600 dark:bg-red-500 text-white font-semibold shadow hover:bg-red-700 dark:hover:bg-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleCreatePass}
                            disabled={matchPassLevel !== 1}
                        >
                            Xác nhận
                        </Button>
                        <button
                            type="button"
                            className="w-full mt-2 text-sm text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                            onClick={() => setCreatePass(1)}
                        >
                            Quay về nhập mật khẩu để khôi phục tin nhắn
                        </button>
                    </div>
                </div>
            )}
            {createPass === 1 && (
                <div className="max-w-[400px] w-full border border-gray-400 dark:border-gray-700 rounded-md shadow p-5 bg-white dark:bg-gray-800 transition-colors">
                    <p className="text-xl font-semibold text-red-600 dark:text-red-400">Nhập mật khẩu khóa bảo vệ</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                        *Nhập mật khẩu để khôi phục tin nhắn đã lưu trữ trước đó. Nếu bạn quên mật khẩu, có thể nhấn <br />
                        <Button
                            variant="ghost"
                            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm underline p-0 h-fit mr-1 font-semibold bg-transparent"
                            onClick={handleResetPasswordKey}
                        >
                            Tạo mới mật khẩu
                        </Button>
                        nhưng sẽ không thể khôi phục tin nhắn !
                    </p>
                    <Input
                        placeholder="Mật khẩu bảo mật"
                        type="password"
                        className="mb-4 mt-2 rounded-md border-gray-400 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white  focus:border-purple-500 focus:dark:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 transition-colors"
                        onChange={(e) => setKeyDecrypt(e.target.value.trim())}
                    />
                    <Button
                        className="w-full rounded-md bg-red-600 dark:bg-red-500 text-white font-semibold shadow hover:bg-red-700 dark:hover:bg-red-400 transition-colors"
                        onClick={getKeyAndDecrypt}
                        disabled={keyDecrypt === ""}
                    >
                        Xác nhận
                    </Button>
                </div>
            )}
            {createPass === 0 && <Loading />}
        </div>
    );
};

export default HandleKey;
