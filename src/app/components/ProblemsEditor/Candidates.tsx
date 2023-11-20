import {
  currentProblemCandidatesAtom,
  currentProblemAtom,
  candidatesCountAtom,
} from "@/jotai/problems";
import { Checkbox, Input } from "@nextui-org/react";
import SimpleLabel from "../ui/SimpleLabel";
import { ChangeEvent } from "react";
import { useAtom, useAtomValue } from "jotai";
import { twMerge } from "tailwind-merge";

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
  const candidatesCount = useAtomValue(candidatesCountAtom);

  const [currentProblemCandidates, setCurrentProblemCandidates] = useAtom(
    currentProblemCandidatesAtom,
  );
  const currentProblem = useAtomValue(currentProblemAtom);

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

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    const index = parseInt(name.split("-")[1]);
    if (!currentProblemCandidates || !currentProblem)
      throw new Error("무언가가 잘못되었습니다.");

    const newCandidates = [...currentProblemCandidates];

    const changedCandidateCheck = (check: boolean) => {
      const candidate = {
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
          newCandidates.forEach((candidate) => {
            candidate.isAnswer = false;
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
      <SimpleLabel
        htmlFor={`candidate-${index}-text`}
        className="text-lg font-semibold"
        preventDefault={true}
      >
        선택지 {index + 1}
      </SimpleLabel>
      <div className="flex items-center">
        <Input
          type="text"
          id={`candidate-${index}-text`}
          value={currentProblemCandidates?.[index]?.text ?? ""}
          variant="bordered"
          classNames={{
            inputWrapper: "border-nextUiBorder",
            input: "text-[.9rem]",
          }}
          size="sm"
          onChange={handleInputChange}
          placeholder={value}
        />
        <div className="flex w-[4rem] justify-center">
          <Checkbox
            name={`candidate-${index}-checkbox`}
            isDisabled={!Boolean(currentProblemCandidates?.[index]?.text)}
            isSelected={currentProblemCandidates?.[index]?.isAnswer ?? false}
            classNames={{
              wrapper: `mx-auto before:border-nextUiBorder`,
            }}
            onChange={handleCheckboxChange}
          />
        </div>
      </div>
    </div>
  ));

  return (
    <div className={twMerge("relative flex flex-col gap-y-1", className)}>
      <SimpleLabel
        className="absolute mt-2 w-[4rem] self-end text-center"
        margin={false}
      >
        정답여부
      </SimpleLabel>
      <div>{candidates}</div>
    </div>
  );
}
