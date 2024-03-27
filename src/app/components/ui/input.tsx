import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  inputClassName?: string;
  wrapperClassName?: string;
  endContent?: React.ReactNode;
  textCenter?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, inputClassName, wrapperClassName, endContent, type, textCenter, ...props },
    ref,
  ) => {
    return (
      <div className={cn("relative flex", wrapperClassName)}>
        <input
          type={type}
          className={cn(
            "border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            endContent ? "pr-9" : "",
            textCenter ? "text-center" : "",
            inputClassName,
          )}
          ref={ref}
          {...props}
        />
        {endContent && (
          <div className="absolute right-0 flex h-full items-center justify-end px-4">
            {endContent}
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
