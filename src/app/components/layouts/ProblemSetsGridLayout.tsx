type Props = {
  children: React.ReactNode;
};

export default function ProblemSetsGridLayout({ children }: Props) {
  return (
    <ul className="mx-auto mt-10 grid w-full grid-cols-1 gap-x-2 gap-y-5 px-0 xs:grid-cols-2 sm:grid-cols-2 sm:p-0 min-[669px]:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {children}{" "}
    </ul>
  );
}
