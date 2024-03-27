import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ChangeEvent, useLayoutEffect } from "react";
import useProblems from "@/hooks/useProblems";
import { Label } from "../ui/label";
export default function CandidateCountSelector() {
  const {
    candidatesCount,
    setCandidatesCount,
    currentProblem,
    currentProblemCandidates,
    setCurrentProblemCandidates,
  } = useProblems();

  useLayoutEffect(() => {
    setCandidatesCount(currentProblem?.candidates?.length.toString() || "4");
  }, [currentProblem?.candidates?.length, setCandidatesCount, candidatesCount]);


  const handleSelectedChange = (value: string) => {

    if (!currentProblemCandidates) throw new Error("무언가가 잘못되었습니다.");

    let newValues = [...currentProblemCandidates];
    const prevLength = newValues.length;

    const selectedIntValue = parseInt(value);
    if (selectedIntValue < prevLength) {
      //선택지 수가 줄어들 때
      newValues = newValues.slice(0, selectedIntValue);
    } else if (selectedIntValue > prevLength) {
      //선택지 수가 늘어날 때
      for (let i = prevLength; i < selectedIntValue; i++) {
        newValues[i] = {
          id: i,
          text: "",
          isAnswer: false,
        };
      }
    } else {
      //선택지 수가 그대로일 때
      return;
    }
    setCandidatesCount(value);
    setCurrentProblemCandidates(newValues);
  };

  return (
    <div className="flex">
      <div className="flex justify-center items-center">
        <Label className="block text-[1rem] mr-2">선택지 개수</Label>
      </div>

      <Select
        defaultValue={candidatesCount}
        onValueChange={handleSelectedChange}
      >
        <SelectTrigger className="w-[4rem]">
          <SelectValue placeholder="선택지 개수를 입력하세요" />
        </SelectTrigger>
        <SelectContent>
          {["2", "3", "4", "5", "6"].map((value) => (
            <SelectItem key={value} value={value}>
              {value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
