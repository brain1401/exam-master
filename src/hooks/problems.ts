import { Problem, candidate } from "@/types/problems";
import { useState } from "react";

export default function useProblems() {
  const [problems, setProblems] = useState<Problem[]>(
    Array<Problem>(10).fill(null)
  );
  const [problemCurrentIndex, setProblemCurrentIndex] = useState(0);
  const [problemSetsName, setProblemSetsName] = useState<string>("");

  const resetProblems = () => {
    setProblems(
      Array<Problem>(10)
        .fill(null)
        .fill(
          {
            type: "obj",
            question: "",
            additionalView: "",
            isAdditiondalViewButtonClicked: false,
            isImageButtonClicked: false,
            image: null,
            candidates: Array<candidate>(4).fill({ text: "", isAnswer: false }),
            subAnswer: null,
          },
          0,
          1
        )
    );
    setProblemCurrentIndex(0);
  };

  return {
    problemCurrentIndex,
    setProblemCurrentIndex,
    problems,
    setProblems,
    problemSetsName,
    setProblemSetsName,
    resetProblems,
  };
}
