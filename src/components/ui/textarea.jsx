import * as React from "react";

import { cn } from "@/lib/utils";
const Textarea = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <textarea
            style={{ scrollbarWidth: "none" }}
            className={cn(
                "flex min-h-[80px] w-full rounded-md  bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground   disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Textarea.displayName = "Textarea";

export { Textarea };
