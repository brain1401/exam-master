type Props = {
  children: React.ReactNode;
}

export default function ExamCard({ children }: Props) {
  return (
    <div className={`rounded-lg bg-slate-200 p-3`}>
      {children}
    </div>
  );
}