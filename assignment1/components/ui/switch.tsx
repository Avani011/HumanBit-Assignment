"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps extends React.HTMLAttributes<HTMLDivElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

const Switch = React.forwardRef<HTMLDivElement, SwitchProps>(
  (
    { className, checked = false, onCheckedChange, disabled = false, ...props },
    ref
  ) => {
    const handleClick = () => {
      if (!disabled && onCheckedChange) {
        onCheckedChange(!checked);
      }
    };

    return (
      <div
        role="switch"
        aria-checked={checked}
        data-state={checked ? "checked" : "unchecked"}
        aria-disabled={disabled}
        data-disabled={disabled ? true : undefined}
        className={cn(
          "inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-violet-600" : "bg-[#3A3A3A]",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        onClick={handleClick}
        ref={ref}
        {...props}
      >
        <span
          data-state={checked ? "checked" : "unchecked"}
          className={cn(
            "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </div>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
