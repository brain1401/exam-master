import useProblems from "@/hooks/useProblems";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

export default function QuestionTextArea() {
  const { currentProblem, setCurrentProblem } = useProblems();

  const { question } = currentProblem ?? {};

  return (
    <div>
      <Label className="mb-1 block text-[1.1rem]">문제</Label>
      <Textarea
        id="question"
        className="resize-none"
        value={question ?? ""}
        onChange={(e) => {
          setCurrentProblem({
            question: e.target.value,
          });
        }}
      />
    </div>
  );
}
