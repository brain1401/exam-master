import { ExamResult } from "@/types/problems";
import Link from "next/link";

type Props = {
  result: ExamResult;
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
      <div className="mx-auto min-w-[9rem] max-w-[12rem] rounded-lg border border-black p-5">
        <h2 className="mb-5 truncate text-center">{result.problemSetName}</h2>
        <p className="mx-auto w-fit whitespace-pre-line text-center text-sm text-gray-500">
          {formattedDate}
        </p>
        <p className="mx-auto w-fit text-sm text-gray-500">{formattedTime}</p>
      </div>
    </Link>
  );
}
