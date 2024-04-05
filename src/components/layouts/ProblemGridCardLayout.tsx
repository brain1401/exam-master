import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function ProblemGridCardLayout({ children, className }: Props) {
  return (
    <li
      className={cn(
        "max-w-[50%] basis-[50%] px-[0.5rem] md:h-auto md:max-w-[25%] md:basis-[25%]",
        className,
      )}
    >
      {children}
    </li>
  );
}
