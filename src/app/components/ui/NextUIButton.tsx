"use client";
import { twMerge } from "tailwind-merge";
import { Button } from "@nextui-org/react";
type Props = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  radius?: "full" | "lg" | "md" | "sm" | "none";
  size?: "sm" | "md" | "lg";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
};
export default function NextUIButton({
  children,
  className,
  onClick,
  disabled = false,
  isLoading = false,
  radius = "sm",
  size = "md",
  color = "primary",
}: Props) {
  return (
    <Button
      className={twMerge(className)}
      onClick={onClick}
      isDisabled={disabled}
      isLoading={isLoading}
      radius={radius}
      color={color}
      size={size}
    >
      {children}
    </Button>
  );
}
