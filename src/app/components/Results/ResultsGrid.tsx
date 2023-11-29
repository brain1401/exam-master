import { ExamResults, ExamResultsWithCount } from "@/types/problems";
import ResultsCard from "./ResultsCard";

type Props = {
  results: ExamResultsWithCount[] | undefined;
};

export default function ResultsGrid({ results }: Props) {
  return (
    <>
      {results && (
        <ul className="mx-auto mt-10 grid w-full grid-cols-1 gap-x-2 gap-y-5 xs:grid-cols-2 sm:grid-cols-2 sm:p-0 min-[669px]:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {results.map((result) => (
            <li key={result.uuid} className="">
              <ResultsCard result={result} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
