type Props = {
  children: React.ReactNode;
};

export default function ProblemLayout({ children }: Props) {
  return (
    <section className="mx-auto pt-10 pb-5 max-w-[70rem]">{children}</section>
  );
}
