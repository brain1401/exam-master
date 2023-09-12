import { ProblemSet } from "@/types/problems";
import Link from "next/link";

type Props = {
  problemSet: ProblemSet;
};

export default function ProblemSetCard({ problemSet }: Props) {
  const formattedDate = new Date(problemSet.updatedAt).toLocaleDateString();

  return (
    <Link href={`/manage/${problemSet.UUID}`}>
      <div className="border border-gray-300 flex flex-col items-center w-full md:w-[10rem] my-2 rounded-lg p-5 hover:shadow-lg transition-shadow duration-200 ease-in cursor-pointer">
        <h1 className="font-bold text-lg text-gray-700 truncate w-full text-center mb-2">
          {problemSet.name}
        </h1>
        <p className="text-sm text-gray-500">{formattedDate}</p>
      </div>
    </Link>
  );
}
