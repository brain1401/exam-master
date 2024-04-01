import useExamProblems from "@/hooks/useExamProblems";

type Props = {
  examProblemLength: number;
};
export default function CurrentProblemIndicator({ examProblemLength }: Props) {
  const { currentExamProblemIndex } = useExamProblems();
  return (
    <div className="text-xl font-semibold">
      <p>{`현재 문제 : ${currentExamProblemIndex + 1}문제/${examProblemLength}문제`}</p>
    </div>
  );
}
