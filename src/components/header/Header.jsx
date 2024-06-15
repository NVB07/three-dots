import Logo from "@/components/icons/logo";

import Link from "next/link";
import Navigate from "./Navigate";
import Options from "./Options";
const Header = () => {
    return (
        <header className="w-full h-[74px] flex justify-center  backdrop-blur-md sticky top-0 left-0 z-50 bg-[hsl(var(--background)/87%)]">
            <div className="flex items-center justify-between max-w-[1230px] px-7 w-full ">
                <div className="w-10 sm:hidden"></div>
                <div className="w-[74px] h-[74px] flex items-center justify-center">
                    <Link scroll={false} href={"/"} className="*:active:scale-100 *:transition-transform *:hover:scale-105  ">
                        <Logo color="hsl(var(--foreground))" width="42" height="42" />
                    </Link>
                </div>

                <div className="hidden sm:block">
                    <Navigate />
                </div>
                <Options />
            </div>
        </header>
    );
};

export default Header;
