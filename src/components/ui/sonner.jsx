"use client";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
    const { theme = "system" } = useTheme();

    return (
        <Sonner
            theme={theme}
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg ",
                    description: "group-[.toast]:text-muted-foreground",
                    actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground !rounded-full",
                    cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground !bg-transparent !text-inherit !rounded-full !w-7 !h-7 !px-1.5",
                },
            }}
            {...props}
        />
    );
};

export { Toaster };
