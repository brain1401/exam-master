type Props = {
  children: React.ReactNode;
};

export default function ProblemLayout({ children }: Props) {
  return (
    <section className="mx-auto pt-10 pb-8 max-w-[70rem] p-3">{children}</section>
  );
}
