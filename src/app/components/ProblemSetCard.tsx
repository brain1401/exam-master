import { ProblemSetResponse } from "@/types/problems";
import Link from "next/link";

type Props = {
  type: "manage" | "exam";
  problemSet: ProblemSetResponse;
};

export default function ProblemSetCard({ type, problemSet }: Props) {
  const formattedDate = new Date(problemSet.updatedAt).toLocaleDateString(
    "ko-KR",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <Link
      href={
        type === "manage"
          ? `/manage/${problemSet.UUID}`
          : `/exam/${problemSet.UUID}`
      }
      className="flex w-full justify-center"
    >
      <div className="my-2 flex w-full cursor-pointer flex-col items-center rounded-lg border border-gray-300 p-5 transition-shadow duration-200 ease-in hover:shadow-lg">
        <p className="w-full truncate text-center text-lg font-bold text-gray-700">
          {problemSet.name}
        </p>
        <p className="mt-3 text-sm text-gray-500">
          {`${problemSet.examProblemsCount}문제` ?? 0}
        </p>
        <p className="mt-1 text-sm text-gray-500">{formattedDate}</p>
      </div>
    </Link>
  );
}
