import { ProblemSet } from "@/types/problems";
import Link from "next/link";

type Props = {
  type: "manage" | "exam";
  problemSet: ProblemSet;
};

export default function ProblemSetCard({ type, problemSet }: Props) {
  const formattedDate = new Date(problemSet.updatedAt).toLocaleDateString();

  return (
    <Link
      href={
        type === "manage"
          ? `/manage/${problemSet.UUID}`
          : `/exam/${problemSet.UUID}`
      }
    >
      <div className="my-2 flex w-full cursor-pointer flex-col items-center rounded-lg border border-gray-300 p-5 transition-shadow duration-200 ease-in hover:shadow-lg md:w-[10rem]">
        <h1 className="w-full truncate text-center text-lg font-bold text-gray-700">
          {problemSet.name}
        </h1>
        <p className="text-sm text-gray-500">
          {`${problemSet.examProblemsCount}문제` ?? 0}
        </p>
        <p className="text-sm text-gray-500">{}</p>
        <p className="text-sm text-gray-500">{formattedDate}</p>
      </div>
    </Link>
  );
}
