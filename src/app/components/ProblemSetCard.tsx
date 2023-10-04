import { ProblemSet } from "@/types/problems";
import Link from "next/link";

type Props = {
  type: "manage" | "exam";
  problemSet: ProblemSet;
};

export default function ProblemSetCard({ type, problemSet }: Props) {
  const formattedDate = new Date(problemSet.updatedAt).toLocaleDateString();

  return (
    <Link href={type === "manage" ? `/manage/${problemSet.UUID}` : `/exam/${problemSet.UUID}`}>
      <div className="border border-gray-300 flex flex-col items-center w-full md:w-[10rem] my-2 rounded-lg p-5 hover:shadow-lg transition-shadow duration-200 ease-in cursor-pointer">
        <h1 className="font-bold text-lg text-gray-700 truncate w-full text-center">
          {problemSet.name}
        </h1>
        <p className="text-sm text-gray-500">{`${problemSet.examProblemsCount}문제` ?? 0}</p>
        <p className="text-sm text-gray-500">{}</p>
        <p className="text-sm text-gray-500">{formattedDate}</p>
      </div>
    </Link>
  );
}
