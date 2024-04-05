import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  type: "public" | "other";
  className?: string;
};

export default function ProblemSetsGridLayout({
  children,
  className,
  type,
}: Props) {
  return (
    <ul
      className={cn(
        "-mx-[0.5rem] flex w-[calc(100%+1rem)] flex-1 flex-row flex-wrap gap-y-[2.2rem] md:gap-y-[1rem]",
        type === "public"
          ? ""
          : "mt-[4rem] gap-y-[1.5rem] md:mt-10 md:gap-y-[2.5rem]",
        className,
      )}
    >
      {children}
    </ul>
  );
}
