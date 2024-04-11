"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { ChevronDown, ChevronUp } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 w-full px-4 py-2",
        sm: "h-9 w-full rounded-md px-3",
        lg: "h-11 w-full rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  popoverContent?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading,
      popoverContent,
      ...props
    },
    ref,
  ) => {
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

    const Comp = asChild ? Slot : "button";

    return (
      <>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Comp
                disabled
                className={cn(
                  buttonVariants({ variant, size, className }),
                  `select-none ${popoverContent ? "!rounded-br-none !rounded-tr-none" : ""}`,
                )}
                ref={ref}
                {...props}
              >
                <AiOutlineLoading3Quarters className="h-4 w-4 animate-spin" />
              </Comp>
              {popoverContent ? (
                <div className="flex h-full items-center justify-center">
                  <PopoverTrigger
                    className={cn(
                      buttonVariants({ variant, size }),
                      "w-fit !rounded-bl-none !rounded-tl-none p-0 px-[.2rem]",
                    )}
                  >
                    {isPopoverOpen ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </PopoverTrigger>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <Comp
                className={cn(
                  buttonVariants({ variant, size, className }),
                  `select-none ${popoverContent ? " rounded-lg !rounded-br-none !rounded-tr-none !pl-5 !pr-2" : ""}`,
                )}
                ref={ref}
                {...props}
              >
                {props.children}
              </Comp>
              {popoverContent ? (
                <div className="flex h-full items-center justify-center">
                  <PopoverTrigger
                    className={cn(
                      buttonVariants({ variant, size }),
                      "w-[2rem] rounded-lg !rounded-bl-none !rounded-tl-none p-0 px-[.2rem]",
                    )}
                  >
                    {isPopoverOpen ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </PopoverTrigger>
                </div>
              ) : null}
            </div>
          )}
          {popoverContent ? (
            <PopoverContent
              className="w-fit translate-x-[-3.7rem] !animate-none"
              align="center"
            >
              {popoverContent}
            </PopoverContent>
          ) : null}
        </Popover>
      </>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
