type Props = {
  children: React.ReactNode;
};

export default function ProblemEditorLayout({ children }: Props) {
  return (
    <section className="mx-auto max-w-[70rem] flex-col p-3 pb-8 pt-6 md:pt-10">
      {children}
    </section>
  );
}
