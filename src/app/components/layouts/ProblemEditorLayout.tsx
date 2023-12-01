type Props = {
  children: React.ReactNode;
};

export default function ProblemEditorLayout({ children }: Props) {
  return (
    <section className="mx-auto max-w-[70rem] p-3 pb-8 pt-10">
      {children}
    </section>
  );
}
