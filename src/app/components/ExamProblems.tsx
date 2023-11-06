"use client";
import usePreventClose from "@/hooks/preventClose";
import { useEffect } from "react";
import Button from "./ui/Button";
import candidateNumber from "@/utils/candidateNumber";
import Image from "next/image";
import cloneDeep from "lodash/cloneDeep";
import checkImage from "/public/check-303494_960_720.png";
import { isImageUrlObject } from "@/service/problems";
import {
  currentExamProblemAtom,
  currentExamProblemIndexAtom,
  examProblemNameAtom,
  examProblemsAtom,
  resetExamProblemsAtom,
} from "../jotai/examProblems";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

export default function ExamProblems() {
  const [currentExamProblem, setCurrentExamProblem] = useAtom(
    currentExamProblemAtom,
  );
  const [currentProblemIndex, setCurrentProblemIndex] = useAtom(
    currentExamProblemIndexAtom,
  );
  const [examProblems] = useAtom(examProblemsAtom);
  const name = useAtomValue(examProblemNameAtom);
  const resetExamProblems = useSetAtom(resetExamProblemsAtom);

  useEffect(() => {
    return () => {
      resetExamProblems();
    };
  }, [resetExamProblems]);

  const onClickCandidate = (i: number, isMultipleAnswer: boolean) => {
    const newCurrentExamProblems = cloneDeep(currentExamProblem);
    const currentCandidate = newCurrentExamProblems?.candidates?.[i];

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
        }
      } else {
        // 현재 문제가 단일 선택지이면서 이미 체크된 답이 없으면
        currentCandidate.isAnswer = !currentCandidate.isAnswer;
      }
    }

    setCurrentExamProblem(newCurrentExamProblems);
  };

  const onTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCurrentExamProblems = cloneDeep(currentExamProblem);
    if (!newCurrentExamProblems) {
      throw new Error("무언가가 잘못되었습니다.");
    }
    newCurrentExamProblems.subAnswer = e.target.value;

    setCurrentExamProblem(newCurrentExamProblems);
  };

  usePreventClose();

  useEffect(() => {
    console.log("currentExamProblem", currentExamProblem);
  }, [currentExamProblem]);

  if (!currentExamProblem) return <div>문제가 없습니다.</div>;

  return (
    <section>
      <div>문제집 이름 : {name}</div>

      <div className="rounded-lg bg-slate-200 p-3">
        <div className="mb-5 text-2xl">
          <span>Q{currentProblemIndex + 1}. </span>
          {currentExamProblem.question}
        </div>

        {currentExamProblem.image &&
          isImageUrlObject(currentExamProblem.image) && (
            <div className="mb-5">
              <Image
                src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${currentExamProblem.image.url}`}
                width={400}
                height={400}
                alt="이미지"
              />
            </div>
          )}

        {currentExamProblem.additionalView && (
          <div className="mb-5 border border-black p-3">
            {currentExamProblem.additionalView}
          </div>
        )}
        {currentExamProblem.type === "obj" && (
          <>
            {
              <div>
                <ul>
                  {currentExamProblem.candidates?.map((candidate, i) => (
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
            }
          </>
        )}

        {currentExamProblem.type === "sub" && (
          <div>
            <textarea
              className="rounded-md border border-black p-3"
              placeholder="답을 입력하세요."
              onChange={onTextAreaChange}
              value={currentExamProblem.subAnswer ?? ""}
            ></textarea>
          </div>
        )}
      </div>

      <div className="mt-2 flex gap-4">
        <Button
          onClick={() => {
            currentProblemIndex > 0 &&
              setCurrentProblemIndex(currentProblemIndex - 1);
          }}
        >
          이전
        </Button>
        <Button
          onClick={() => {
            currentProblemIndex < examProblems.exam_problems.length - 1 &&
              setCurrentProblemIndex(currentProblemIndex + 1);
          }}
        >
          다음
        </Button>
      </div>
    </section>
  );
}
