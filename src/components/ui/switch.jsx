import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Switch({ className, size = "default", ...props }) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        // track (nền)
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors",
        "bg-gray-300 data-[state=checked]:bg-green-500",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          // circle
          "block h-5 w-5 rounded-full bg-white shadow-md transition-transform",
          "translate-x-0 data-[state=checked]:translate-x-5",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
