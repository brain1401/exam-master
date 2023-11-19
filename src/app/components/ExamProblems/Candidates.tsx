import { currentExamProblemAtom } from "@/jotai/examProblems";
import { Problem } from "@/types/problems";
import candidateNumber from "@/utils/candidateNumber";
import { useAtom } from "jotai";
import Image from "next/image";
import checkImage from "/public/check.png";

export default function Candidates() {
  const [currentExamProblem, setCurrentExamProblem] = useAtom(
    currentExamProblemAtom,
  );

  const onClickCandidate = (i: number, isMultipleAnswer: boolean) => {
    const newCurrentExamProblems = { ...currentExamProblem };

    if (!newCurrentExamProblems || !newCurrentExamProblems.candidates) {
      throw new Error("무언가가 잘못되었습니다.");
    }
    const currentCandidate = [...newCurrentExamProblems.candidates]?.[i];

    if (
      currentCandidate?.isAnswer === undefined ||
      newCurrentExamProblems?.isAnswerMultiple === undefined ||
      newCurrentExamProblems?.type === undefined ||
      !newCurrentExamProblems?.candidates
    ) {
      throw new Error("무언가가 잘못되었습니다.");
    }

    if (isMultipleAnswer) {
      // 현재 문제가 다중 선택지이면
      currentCandidate.isAnswer = !currentCandidate.isAnswer;
    } else {
      // 현재 문제가 단일 선택지이면

      if (
        newCurrentExamProblems.candidates.some(
          (candidate) => candidate.isAnswer === true,
        )
      ) {
        // 현재 문제가 단일 선택지이면서 이미 체크된 답이 있으면
        if (
          currentCandidate.id ===
          newCurrentExamProblems.candidates.find(
            (candidate) => candidate.isAnswer === true,
          )?.id
        ) {
          // 현재 문제가 단일 선택지이면서 이미 체크된 답이 현재 클릭한 답과 같으면
          currentCandidate.isAnswer = !currentCandidate.isAnswer;
        } else {
          // 현재 문제가 단일 선택지이면서 이미 체크된 답이 현재 클릭한 답과 다르면
          newCurrentExamProblems.candidates.forEach((candidate) => {
            candidate.isAnswer = false;
          });
          currentCandidate.isAnswer = true;
        }
      } else {
        // 현재 문제가 단일 선택지이면서 이미 체크된 답이 없으면
        currentCandidate.isAnswer = !currentCandidate.isAnswer;
      }
    }

    newCurrentExamProblems.candidates = newCurrentExamProblems.candidates.map(
      (candidate) => {
        if (candidate.id === currentCandidate.id) {
          return currentCandidate;
        } else {
          return candidate;
        }
      },
    );

    setCurrentExamProblem(newCurrentExamProblems as NonNullable<Problem>);
  };
  return (
    <div>
      <ul>
        {currentExamProblem?.candidates?.map((candidate, i) => (
          <li key={i} className="flex">
            <div
              className="relative cursor-pointer select-none md:hover:font-bold"
              onClick={(e) => {
                onClickCandidate(
                  i,
                  currentExamProblem.isAnswerMultiple ?? false,
                );
              }}
            >
              <div
                className={`${
                  candidate.isAnswer ? "" : "opacity-0"
                } absolute left-1 top-[-.2rem] h-5 w-5`}
              >
                <Image src={checkImage} alt="체크" fill />
              </div>
              <span>{candidateNumber(i + 1)}</span>
              {` ${candidate.text}`}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
