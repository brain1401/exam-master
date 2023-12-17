import ProblemSetsGridLayout from "../layouts/ProblemSetsGridLayout";

type Props = {
  pageSize: number;
};

export default function ResultsCardSkeleton({ pageSize }: Props) {
  const skeletonArray = Array.from({ length: pageSize }, (_, i) => i);

  return (
    <ProblemSetsGridLayout>
      {skeletonArray.map((_, i) => (
        <li
          className="mx-auto flex min-w-[9rem] max-w-[12rem] animate-pulse flex-col items-center justify-center rounded-lg border border-gray-600 p-5"
          key={i}
        >
          <div className="mb-1 h-[1.8rem] w-[10rem] rounded-md bg-gray-300 text-xl"></div>
          <div className="mt-1 h-[1rem] w-[5rem] rounded-md bg-gray-300 "></div>
          <div className="mx-auto mt-1 h-[1rem] w-[8rem] rounded-md bg-gray-300  text-sm text-gray-500"></div>
          <div className="mx-auto mt-1 h-[1rem] w-[8rem] rounded-md bg-gray-300 text-sm text-gray-500"></div>
        </li>
      ))}
    </ProblemSetsGridLayout>
  );
}
