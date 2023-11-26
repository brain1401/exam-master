"use client";

import { ClipLoader } from "react-spinners";
import { twMerge } from "tailwind-merge";
type Props = {
  className?: string;
};
export default function CustomLoading({ className }: Props) {
  return (
    <section
      className={twMerge("flex w-full items-center justify-center", className)}
    >
      <ClipLoader size={100} />
    </section>
  );
}
