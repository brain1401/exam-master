type Props = {
  children: React.ReactNode;
};

export default function ProblemEditorLayout({ children }: Props) {
  return (
    <section className="mx-auto flex h-full w-full max-w-[60rem] flex-1 flex-col p-3 pb-8 pt-4 md:pt-10">
      {children}
    </section>
  );
}
