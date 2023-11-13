import { Checkbox } from "@nextui-org/react";
import SimpleLabel from "../ui/SimpleLabel";
import { ChangeEvent } from "react";
import { currentProblemAtom } from "@/jotai/problems";
import { useAtom } from "jotai";

export default function MultipleAnswerCheckbox() {
  const [currentProblem, setCurrentProblem] = useAtom(currentProblemAtom);

  const handleMultipleAnswerCheckboxChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if (!currentProblem) throw new Error("무언가가 잘못되었습니다.");

    const count = currentProblem.candidates?.reduce((acc, cur) => {
      if (cur.isAnswer === true) {
        acc++;
      }
      return acc;
    }, 0);

    if (count === undefined) throw new Error("무언가가 잘못되었습니다.");

    if (event.target.checked === false && count >= 2) {
      // 체크를 해제하려고 하는데 이미 2개 이상의 정답이 선택되어 있으면 경고창을 띄우고 체크를 해제하지 않음
      alert(`이미 ${count}개의 정답이 선택되어 있습니다. 다시 확인해주세요.`);
      return;
    }

    setCurrentProblem({
      isAnswerMultiple: event.target.checked,
    });
  };

  return (
    <>
      <SimpleLabel htmlFor="isAnswerMultiple">복수정답</SimpleLabel>
      <Checkbox
        type="checkbox"
        classNames={{
          wrapper: `ml-2 before:!border-nextUiBorder`,
        }}
        id="isAnswerMultiple"
        isSelected={currentProblem?.isAnswerMultiple ?? false}
        onChange={handleMultipleAnswerCheckboxChange}
      />
    </>
  );
}
