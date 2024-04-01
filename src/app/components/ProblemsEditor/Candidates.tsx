import SimpleLabel from "../ui/SimpleLabel";
import { ChangeEvent } from "react";
import useProblems from "@/hooks/useProblems";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

const candidatePlaceholders = [
  "네가 내 손에 죽고 싶구나?",
  "나는 50점 받았다. 잘난 척 하니 속이 후련하니?",
  "평균 99점이 못 본 거라니. 너 정신이 이상하구나?",
  "다른 데서 그런 식으로 말하면 너는 학교 폭력의 피해자가 될지도 몰라",
];

type Props = {
  className?: string;
};
export default function Candidates({ className }: Props) {
  const {
    candidatesCount,
    currentProblemCandidates,
    setCurrentProblemCandidates,
    currentProblem,
  } = useProblems();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    const index = parseInt(id.split("-")[1]);

    if (!currentProblemCandidates) throw new Error("무언가가 잘못되었습니다.");

    const newCandidates = [...currentProblemCandidates];

    newCandidates[index] = {
      id: index,
      text: value,
      isAnswer:
        (value === "" ? false : newCandidates[index]?.isAnswer) ?? false,
    };

    setCurrentProblemCandidates(newCandidates);
  };

  const handleCheckboxChange = (index: number, check: CheckedState) => {
    if (!currentProblemCandidates || !currentProblem)
      throw new Error("무언가가 잘못되었습니다.");

    const checked = check === "indeterminate" ? false : check;

    const newCandidates = [...currentProblemCandidates];

    const changedCandidateCheck = (check: boolean) => {
      const candidate = {
        ...newCandidates[index],
        id: newCandidates[index]?.id ?? index,
        text: newCandidates[index]?.text ?? "",
        isAnswer: check,
      };

      return candidate;
    };

    if (currentProblem.isAnswerMultiple === true) {
      newCandidates[index] = changedCandidateCheck(checked);
    } else {
      if (
        currentProblem.candidates?.some(
          (candidate) => candidate.isAnswer === true,
        )
      ) {
        if (
          newCandidates[index]?.id ===
          currentProblem.candidates.find(
            (candidate) => candidate.isAnswer === true,
          )?.id
        ) {
          newCandidates[index] = changedCandidateCheck(checked);
        } else {
          newCandidates.forEach((candidate, index) => {
            newCandidates[index] = { ...candidate, isAnswer: false };
          });
          newCandidates[index] = changedCandidateCheck(checked);
        }
      } else {
        newCandidates[index] = changedCandidateCheck(checked);
      }
    }

    setCurrentProblemCandidates(newCandidates);
  };

  const candidates = Array.from(
    { length: parseInt(candidatesCount) },
    (_, index) => candidatePlaceholders[index] ?? "",
  ).map((value, index) => (
    <div key={index} className="my-2 flex flex-col">
      <Label
        htmlFor={`candidate-${index}-text`}
        className="block mb-1 font-bold text-[1.1rem]"
        preventDefault={true}
      >
        선택지 {index + 1}
      </Label>
      <div className="flex items-center">
        <Input
          type="text"
          wrapperClassName="flex-1"
          inputClassName="h-[2.9rem]"
          id={`candidate-${index}-text`}
          value={currentProblemCandidates?.[index]?.text ?? ""}
          onChange={handleInputChange}
          placeholder={value}
        />
        <div className="flex w-[4rem] justify-center">
          <Checkbox
            name={`candidate-${index}-checkbox`}
            className="w-[1.15rem] h-[1.15rem]"
            disabled={!Boolean(currentProblemCandidates?.[index]?.text)}
            checked={currentProblemCandidates?.[index]?.isAnswer ?? false}
            onCheckedChange={(checked) => handleCheckboxChange(index, checked)}
          />
        </div>
      </div>
    </div>
  ));

  return (
    <div className={cn("relative flex flex-col gap-y-1", className)}>
      <SimpleLabel
        className="absolute mt-2 w-[4rem] self-end text-center"
        margin={false}
      >
        정답여부
      </SimpleLabel>
      <div className="flex flex-col">{candidates}</div>
    </div>
  );
}
