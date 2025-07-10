"use client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { useEffect, useState, useRef } from "react";
import NodeRSA from "node-rsa";
import aesjs from "aes-js";
import sha256 from "js-sha256";
import Loading from "@/components/pages/loading/Loading";
import Cookies from "js-cookie";
import { getDocument } from "@/firebase/services";

const HandleKey = ({ setPrivateKey, uid }) => {
    const [passwordEncrypt, setPasswordEncrypt] = useState("");
    const [rePasswordEncrypt, setRePasswordEncrypt] = useState("");
    const [matchPassLevel, setMatchPassLevel] = useState(0);
    const [createPass, setCreatePass] = useState(0);
    const [keyDecrypt, setKeyDecrypt] = useState("");
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
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
    const handleMatchPass = () => {
        if (passwordEncrypt && passwordEncrypt === rePasswordEncrypt && passwordRegex.test(passwordEncrypt.trim())) {
            setMatchPassLevel(1);
        } else if (passwordEncrypt && passwordEncrypt !== rePasswordEncrypt) {
            setMatchPassLevel(2);
        } else if (passwordEncrypt && !passwordRegex.test(passwordEncrypt.trim())) {
            setMatchPassLevel(3);
        }
    };
    const genKey = () => {
        const key = new NodeRSA({ b: 2048 });
        const publicKey = key.exportKey("public");
        const privateKey = key.exportKey("private");
        return { publicKey, privateKey };
    };

    const encryptAES = (plainText, key) => {
        const iv = "b61ade79da2db1bca782ec9e9ef6a76e";
        const messageBytes = aesjs.utils.utf8.toBytes(plainText);
        const paddedMessage = aesjs.padding.pkcs7.pad(messageBytes);
        const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
        const encryptedBytes = aesCbc.encrypt(paddedMessage);
        const encryptedBase64 = btoa(String.fromCharCode(...encryptedBytes));

        return encryptedBase64;
    };
    const getSha256Bytes = (text) => {
        const hashHex = sha256(text); // chuỗi hex dài 64 ký tự (256 bit)
        const bytes = [];
        for (let i = 0; i < hashHex.length; i += 2) {
            bytes.push(parseInt(hashHex.substr(i, 2), 16));
        }
        return Uint8Array.from(bytes); // Trả về 32 byte
    };
    const getKeyAndDecrypt = async () => {
        try {
            const docSnap = await getDocument("secretKeyEncrypted", uid);
            if (docSnap.exists()) {
                const encryptedKey = docSnap.data().key;

                const keyBytes = getSha256Bytes(keyDecrypt); // giống như mobile

                const iv = aesjs.utils.hex.toBytes("b61ade79da2db1bca782ec9e9ef6a76e"); // IV cố định
                const encryptedBytes = Uint8Array.from(atob(encryptedKey), (c) => c.charCodeAt(0));

                const aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, iv);
                const decryptedBytes = aesCbc.decrypt(encryptedBytes);
                const unpadded = aesjs.padding.pkcs7.strip(decryptedBytes);
                const decryptedText = aesjs.utils.utf8.fromBytes(unpadded);
                Cookies.set("privateKey", decryptedText);
                setPrivateKey(decryptedText);
            } else {
                console.error("Không tìm thấy khóa!");
            }
        } catch (error) {
            console.error("Lỗi khi giải mã khóa:", error);
            alert("Sai mật khẩu hoặc dữ liệu không hợp lệ.");
        }
    };
    const handleCreatePass = () => {
        if (matchPassLevel === 1) {
            console.log(passwordEncrypt);

            const rsaKey = genKey();
            console.log(rsaKey);
        }
    };

    return (
        <div className="w-full h-screen flex justify-center items-center ">
            {createPass === 2 && (
                <div className="w-full h-screen flex justify-center items-center  ">
                    <div className="max-w-[400px] w-full border border-gray-400 rounded-md p-5">
                        <p className="text-xl font-semibold text-red-600">Tạo mật khẩu khóa bảo mật</p>
                        <p className="text-sm text-gray-600 italic">
                            *Mật mã này để bảo mật và đồng bộ tin nhắn của bạn. Hãy sao lưu và giữ nó một cách an toàn. Nếu bạn quên mật khẩu này, sẽ không thể khôi phục
                            tin nhắn trong tương lai !
                        </p>
                        <Input
                            placeholder="Mật khẩu mới"
                            type="password"
                            className=" mt-2"
                            value={passwordEncrypt}
                            onChange={(e) => setPasswordEncrypt(e.target.value.trim())}
                        />
                        <Input
                            placeholder="Nhập lại mật khẩu"
                            type="password"
                            className=" mt-2"
                            value={rePasswordEncrypt}
                            onChange={(e) => setRePasswordEncrypt(e.target.value.trim())}
                        />
                        <div className=" px-1 h-4 pt-0.5 mb-4">{matchPassLevel === 2 && <p className="text-red-600 text-xs italic">Mật khẩu không khớp</p>}</div>
                        <Button className={"w-full"} onClick={handleCreatePass}>
                            Xác nhận
                        </Button>
                    </div>
                </div>
            )}
            {createPass === 1 && (
                <div className="max-w-[400px] w-full border border-gray-400 rounded-md p-5">
                    <p className="text-xl font-semibold text-red-600"> Nhập mật khẩu khóa bảo vệ</p>
                    <p className="text-sm text-gray-600 italic">
                        *Nhập mật khẩu để khôi phục tin nhắn đã lưu trữ trước đó. Nếu bạn quên mật khẩu, có thể nhấn <br />
                        <Button variant="ghost" className="text-white hover:text-red-500 text-sm underline p-0 h-fit mr-1">
                            Tạo mới mật khẩu
                        </Button>
                        nhưng sẽ không thể khôi phục tin nhắn !
                    </p>
                    <Input placeholder="Mật khẩu bảo mật" type="password" className="mb-4 mt-2" onChange={(e) => setKeyDecrypt(e.target.value.trim())} />

                    <Button className={"w-full"} onClick={getKeyAndDecrypt}>
                        Xác nhận
                    </Button>
                </div>
            )}
            {createPass === 0 && <Loading />}
        </div>
    );
};

export default HandleKey;
