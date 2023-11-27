import useProblems from "@/hooks/useProblems";
import { Textarea } from "@nextui-org/react";

export default function QuestionTextArea() {
  const { currentProblem, setCurrentProblem } = useProblems();
  
  const { question } = currentProblem ?? {};

  return (
    <Textarea
      id="question"
      classNames={{
        inputWrapper: `w-full !h-[6rem] border-nextUiBorder`,
        input: "text-[1rem]",
        label: "text-md font-semibold text-lg",
      }}
      maxRows={3}
      label="문제"
      labelPlacement="outside"
      placeholder="다음의 친구에게 해 줄 수 있는 말로 적절한 것은?"
      value={question ?? ""}
      variant="bordered"
      onChange={(e) => {
        setCurrentProblem({
          question: e.target.value,
        });
      }}
    />
  );
}
