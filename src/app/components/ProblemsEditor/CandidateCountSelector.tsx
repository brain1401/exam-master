import { Select, SelectItem } from "@nextui-org/react";
import { ChangeEvent, useLayoutEffect } from "react";
import {
  currentProblemCandidatesAtom,
  candidatesCountAtom,
  currentProblemAtom,
} from "@/jotai/problems";
import { useAtom, useAtomValue } from "jotai";
export default function CandidateCountSelector() {
  const [candidatesCount, setCandidatesCount] = useAtom(candidatesCountAtom);
  const currentProblem = useAtomValue(currentProblemAtom);

  const [currentProblemCandidates, setCurrentProblemCandidates] = useAtom(
    currentProblemCandidatesAtom,
  );

  useLayoutEffect(() => {
    setCandidatesCount(currentProblem?.candidates?.length.toString() ?? "4");
    console.log("setCandidatesCount ", currentProblem?.candidates?.length);
  }, [setCandidatesCount, currentProblem?.candidates?.length]);

  const handleSelectedChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value: selectedValue } = event.target;
    setCandidatesCount(selectedValue);

    if (!currentProblemCandidates) throw new Error("무언가가 잘못되었습니다.");

    let newValues = [...currentProblemCandidates];
    const prevLength = newValues.length;

    const selectedIntValue = parseInt(selectedValue);
    if (selectedIntValue < prevLength) {
      //선택지 수가 줄어들 때
      newValues = newValues.slice(0, selectedIntValue);
    } else {
      //선택지 수가 늘어날 때
      for (let i = prevLength; i < selectedIntValue; i++) {
        newValues[i] = {
          id: i,
          text: "",
          isAnswer: false,
        };
      }
    }
    setCurrentProblemCandidates(newValues);
  };

  return (
    <>
      <Select
        selectedKeys={candidatesCount}
        onChange={handleSelectedChange}
        classNames={{
          base: "",
          label: "text-md font-semibold justify-self-center self-center",
          mainWrapper: `w-[3.5rem]`,
          trigger: `border-nextUiBorder`,
          value: "text-center",
        }}
        variant="bordered"
        label="선택지 수"
        labelPlacement="outside-left"
        size="sm"
      >
        {["2", "3", "4", "5", "6"].map((value) => (
          <SelectItem
            key={value}
            value={value}
            classNames={{
              selectedIcon: "hidden",
              title: "text-center",
            }}
          >
            {value}
          </SelectItem>
        ))}
      </Select>
    </>
  );
}
