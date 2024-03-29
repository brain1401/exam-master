import * as React from "react";

import { cn } from "@/lib/utils";

export interface CardProps extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, wrapperClassName, ...props }, ref) => (
    <>
      {wrapperClassName ? (
        <div className={wrapperClassName}>
          <div
            ref={ref}
            className={cn(
              "flex h-[9.5rem] cursor-pointer flex-col rounded-lg border bg-card text-card-foreground shadow-sm md:h-auto",
              className,
            )}
            {...props}
          />
        </div>
      ) : (
        <div
          ref={ref}
          className={cn(
            "flex h-[9.5rem] flex-col rounded-lg border bg-card text-card-foreground shadow-sm md:h-auto",
            className,
          )}
          {...props}
        />
      )}
    </>
  ),
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col px-4 pb-0 pt-4 md:p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "truncate text-[1.2rem] font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("truncate text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-1 items-end px-4 pb-4 pt-2 md:p-6", className)}
    {...props}
  />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
