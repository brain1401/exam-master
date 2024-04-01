"use client";

import { cn } from "@/lib/utils";
import { ClipLoader } from "react-spinners";
type Props = {
  className?: string;
};
export default function CustomLoading({ className }: Props) {
  return (
    <section
      className={cn("flex w-full items-center justify-center", className)}
    >
      <ClipLoader size={100} />
    </section>
  );
}
