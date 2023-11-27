type Props = {
  children: React.ReactNode;
};

export default function ProblemEditorLayout({ children }: Props) {
  return (
    <section className="mx-auto mb-5 mt-8 max-w-[70rem]">{children}</section>
  );
}
