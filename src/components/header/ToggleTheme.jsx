"use client";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Moon, Sun, Auto } from "@/components/icons/ThemeIcons";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
export default function ToggleTheme({ variant = "ghost" }) {
    const { setTheme } = useTheme();
    const [openMenuTheme, setOpenMenuTheme] = useState();
    return (
        <Popover onOpenChange={setOpenMenuTheme} open={openMenuTheme}>
            <PopoverTrigger asChild>
                <Button
                    onClick={() => setOpenMenuTheme(true)}
                    variant={variant}
                    size="icon"
                    className="px-2 flex items-center justify-start w-full rounded-none rounded-t-md "
                >
                    <div className="mr-2 text-base">Giao diện</div>
                    <div className="flex items-center">
                        <Sun style="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon style="absolute  h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full flex items-center p-0">
                <Button
                    variant="ghost"
                    className=" transition-all p-2 rounded-none rounded-l-md "
                    onClick={() => {
                        setOpenMenuTheme(false);
                        setTheme("light");
                    }}
                >
                    <Sun width={24} height={24} />
                </Button>
                <Button
                    variant="ghost"
                    className=" transition-all p-2 rounded-none  "
                    onClick={() => {
                        setOpenMenuTheme(false);
                        setTheme("dark");
                    }}
                >
                    <Moon width={24} height={24} />
                </Button>
                <Button
                    variant="ghost"
                    className=" transition-all p-2 rounded-none rounded-r-md "
                    onClick={() => {
                        setOpenMenuTheme(false);
                        setTheme("system");
                    }}
                >
                    <Auto width={24} height={24} />
                </Button>
            </PopoverContent>
        </Popover>
    );
}
