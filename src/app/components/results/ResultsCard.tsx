import { ExamResultsWithCount } from "@/types/problems";
import Link from "next/link";
type Props = {
  result: ExamResultsWithCount;
};

export default function ResultsCard({ result }: Props) {
  const formattedDate = new Date(result.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = new Date(result.createdAt).toLocaleTimeString("ko-KR", {
    hour: "numeric",
    minute: "numeric",
  });

  return (
    <Link href={`/result/${result.uuid}`}>
      <div className="mx-auto min-w-[9rem] max-w-[12rem] rounded-lg border border-gray-600 p-5">
        <h2 className="mb-1 truncate text-center text-xl">
          {result.problemSetName}
        </h2>
        <p className="text-center text-sm font-semibold">{`${result.examProblemResultsCount} 문제`}</p>
        <p className="mx-auto w-fit whitespace-pre-line text-center text-sm text-gray-500">
          {formattedDate}
        </p>
        <p className="mx-auto w-fit text-sm text-gray-500">{formattedTime}</p>
      </div>
    </Link>
  );
}
