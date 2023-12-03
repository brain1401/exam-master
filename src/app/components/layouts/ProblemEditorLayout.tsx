type Props = {
  children: React.ReactNode;
};

export default function ProblemEditorLayout({ children }: Props) {
  return (
    <section className="mx-auto flex w-full h-full max-w-[70rem] flex-1 flex-col p-3 pb-8 pt-10">
      {children}
    </section>
  );
}
