"use client";
import { twMerge } from "tailwind-merge";
type Props = {
  children: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
};
export default function Button({
  children,
  className,
  onClick,
  disabled = false,
}: Props) {
  return (
    <button
      className={twMerge(
        `select-none rounded-md bg-blue-300 px-5 py-2 transition-colors hover:border-neutral-500 hover:border-transparent hover:bg-neutral-500 hover:text-white`,
        className,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
