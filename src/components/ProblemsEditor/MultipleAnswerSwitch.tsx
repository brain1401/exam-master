import SimpleLabel from "../ui/SimpleLabel";
import { ChangeEvent } from "react";
import useProblems from "@/hooks/useProblems";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

export default function MultipleAnswerSwitch() {
  const {currentProblem, setCurrentProblem} = useProblems();

  const handleMultipleAnswerCheckboxChange = (
    checked: boolean,
  ) => {
    if (!currentProblem) throw new Error("무언가가 잘못되었습니다.");

    const count = currentProblem.candidates?.reduce((acc, cur) => {
      if (cur.isAnswer === true) {
        acc++;
      }
      return acc;
    }, 0);

    if (count === undefined) throw new Error("무언가가 잘못되었습니다.");

    if (checked === false && count >= 2) {
      // 체크를 해제하려고 하는데 이미 2개 이상의 정답이 선택되어 있으면 경고창을 띄우고 체크를 해제하지 않음
      alert(`이미 ${count}개의 정답이 선택되어 있습니다. 다시 확인해주세요.`);
      return;
    }

    setCurrentProblem({
      isAnswerMultiple: checked,
    });
  };

  return (
    <>
      <Label
        htmlFor="isAnswerMultiple"
        className="block text-[1rem] mr-2"
      >
        복수정답
      </Label>
      <Switch
        id="isAnswerMultiple"
        className="translate-y-[.1rem]"
        checked={currentProblem?.isAnswerMultiple ?? false}
        onCheckedChange={handleMultipleAnswerCheckboxChange}
      />
    </>
  );
}
