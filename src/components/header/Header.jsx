"use client";
import { AuthContext } from "@/context/AuthProvider";
import { useContext } from "react";
import Logo from "../icons/Logo";
import Link from "next/link";
import Navigate from "./Navigate";
import Options from "./Options";
const Header = () => {
    const { authUserData } = useContext(AuthContext);
    if (!authUserData) {
        return null;
    }
    return (
        <header className="w-full h-[74px] flex justify-center bg-  backdrop-blur-md sticky top-0 left-0 z-50 bg-[#1f1f1f9f]">
            <div className="flex items-center justify-between max-w-[1230px] px-7 w-full ">
                <div className="w-[74px] sm:hidden"></div>
                <div className="w-[74px] h-[74px] flex items-center justify-center">
                    <Link scroll={false} href={"/"} className="*:active:scale-100 *:transition-transform *:hover:scale-105  ">
                        <Logo color="hsl(var(--foreground))" width="42" height="42" />
                    </Link>
                </div>

                <div className="hidden sm:block">
                    <Navigate />
                </div>
                <div className="w-[74px] flex items-center justify-center">
                    <Options />
                </div>
            </div>
        </header>
    );
};

export default Header;
