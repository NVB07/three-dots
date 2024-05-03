"use client";
import { Moon, Sun, Cpu } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
export default function ToggleTheme({ variant = "ghost" }) {
    const { setTheme } = useTheme();
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={variant} size="icon" className="px-2 flex items-center w-full rounded-none rounded-t-md ">
                    <div className="mr-2 text-base">Giao diện</div>
                    <div className="flex items-center">
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute  h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full flex items-center p-0">
                <Button variant="ghost" className=" transition-all p-2 rounded-none rounded-l-md " onClick={() => setTheme("light")}>
                    <Sun />
                </Button>
                <Button variant="ghost" className=" transition-all p-2 rounded-none  " onClick={() => setTheme("dark")}>
                    <Moon />
                </Button>
                <Button variant="ghost" className=" transition-all p-2 rounded-none rounded-r-md " onClick={() => setTheme("system")}>
                    <Cpu />
                </Button>
            </PopoverContent>
        </Popover>
    );
}
