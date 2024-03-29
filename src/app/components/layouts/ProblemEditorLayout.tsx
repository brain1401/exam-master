type Props = {
  children: React.ReactNode;
};

export default function ProblemEditorLayout({ children }: Props) {
  return (
    <section className="mx-auto flex-1 w-full max-w-[70rem] p-4 flex-col">
      {children}
    </section>
  );
}
