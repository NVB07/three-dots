"use client";
import { useTheme } from "next-themes";
import { Moon, Sun, Auto } from "@/components/icons/ThemeIcons";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function ToggleTheme() {
    const { theme, setTheme } = useTheme();
    return (
        <div className="flex w-full justify-between items-center px-2">
            <span>Giao diện</span>
            <ToggleGroup type="single" defaultValue={theme}>
                <ToggleGroupItem
                    value="light"
                    onClick={() => setTheme("light")}
                    className="w-8 h-8 p-0 text-[#acacac] data-[state=on]:text-foreground data-[state=on]:border "
                >
                    <Sun width={20} height={20} />
                </ToggleGroupItem>
                <ToggleGroupItem
                    value="dark"
                    onClick={() => setTheme("dark")}
                    className="w-8 h-8 p-0 text-[#acacac] data-[state=on]:text-foreground data-[state=on]:border"
                >
                    <Moon width={20} height={20} />
                </ToggleGroupItem>
                <ToggleGroupItem
                    value="system"
                    onClick={() => setTheme("system")}
                    className="w-8 h-8 p-0 text-[#acacac] data-[state=on]:text-foreground data-[state=on]:border"
                >
                    <Auto width={20} height={20} />
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    );
}
