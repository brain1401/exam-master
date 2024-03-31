type Props = {
  children: React.ReactNode;
};

export default function ProblemSetsGridLayout({ children }: Props) {
  return (
    <ul className="mx-auto mt-10 flex w-full min-w-0 flex-1 flex-row flex-wrap gap-y-[2.5rem] ">
      {children}
    </ul>
  );
}
