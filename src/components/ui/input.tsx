import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  inputClassName?: string;
  wrapperClassName?: string;
  endContent?: React.ReactNode;
  textCenter?: boolean;
  allowOnlyNumber?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      inputClassName,
      wrapperClassName,
      endContent,
      allowOnlyNumber,
      type,
      textCenter,
      onChange,
      ...props
    },
    ref,
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (allowOnlyNumber) {
        const value = e.target.value;
        const numericValue = value.replace(/[^0-9]/g, "");
        e.target.value = numericValue;
      }
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className={cn("relative flex h-fit", wrapperClassName)}>
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            endContent ? "pr-9" : "",
            textCenter ? "text-center" : "",
            inputClassName,
          )}
          {...(allowOnlyNumber && {
            inputMode: "numeric",
            pattern: "[0-9]*",
          })}
          ref={ref}
          onChange={handleChange}
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
