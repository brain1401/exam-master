import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function ExamLayout({ children, className }: Props) {
  return <section className={cn("mx-auto w-full max-w-3xl py-[3rem] px-[1.5rem]",className)}>{children}</section>;
}
