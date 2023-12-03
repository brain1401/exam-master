type Props = {
  children: React.ReactNode;
};

export default function ProblemGridLayout({ children }: Props) {
  return (
    <section className="mx-auto flex w-full max-w-[70rem] flex-1 flex-col overflow-y-hidden p-3 pb-8 pt-10">
      {children}
    </section>
  );
}
