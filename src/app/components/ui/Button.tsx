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
        `rounded-md border border-black px-5 py-2 transition-colors duration-300 hover:border-neutral-500 hover:border-transparent hover:bg-neutral-500 hover:text-white`,
        className,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
