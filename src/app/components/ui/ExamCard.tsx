import { twMerge } from "tailwind-merge";

type Props = {
  children: React.ReactNode;
  correct?: boolean;
}

export default function ExamCard({ children, correct = true }: Props) {
  return (
    <div className={twMerge(`rounded-lg bg-slate-200 p-3`,`${correct === true ? "" : "bg-rose-400"}`)}>
      {children}
    </div>
  );
}