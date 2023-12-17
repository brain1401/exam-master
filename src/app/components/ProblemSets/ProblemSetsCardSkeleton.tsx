import ProblemSetsGridLayout from "../layouts/ProblemSetsGridLayout";

type Props = {
  pageSize: number;
};

export default function ProblemSetsCardSkeleton({ pageSize }: Props) {
  const skeletonArray = Array.from({ length: pageSize }, (_, i) => i) ;

  return (
    <ProblemSetsGridLayout>
      {skeletonArray.map((_, i) => (
        <li
          key={i}
          className="my-2 flex w-full animate-pulse flex-col items-center justify-center rounded-lg border border-gray-300 p-5"
        >
          <div className="h-[1.8rem] w-[10rem] rounded-md bg-gray-300 text-center text-lg font-bold text-gray-700" />
          <div className="mt-3 h-[1.3rem] w-[8rem] rounded-md bg-gray-300 text-sm text-gray-500" />
          <div className="mt-1 h-[1.3rem] w-[8rem] rounded-md bg-gray-300 text-sm text-gray-500" />
        </li>
      ))}
    </ProblemSetsGridLayout>
  );
}
