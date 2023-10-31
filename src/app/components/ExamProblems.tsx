"use client";
import usePreventClose from "@/hooks/preventClose";
import { ProblemSetWithName } from "@/types/problems";
import { problemShuffle } from "@/utils/problemShuffle";
import { useState, useEffect } from "react";
import Button from "./ui/Button";
import candidateNumber from "@/utils/candidateNumber";
import Image from "next/image";
import cloneDeep from "lodash/cloneDeep";
import checkImage from "/public/check-303494_960_720.png";
import { isImageUrlObject } from "@/service/problems";

type Props = {
  problems: ProblemSetWithName;
};

export default function ExamProblems({ problems }: Props) {
  const { name, exam_problems } = problems;
  const [shuffledExamProblems, setShuffledExamProblems] =
    useState<ProblemSetWithName>({
      name,
      exam_problems: problemShuffle(exam_problems),
    });

  const { exam_problems: shuffledExamProblemsArray } = shuffledExamProblems;
  const [currentProblemIndex, setCurrentProblemIndex] = useState<number>(0);

  const currentShuffledExamProblem =
    shuffledExamProblemsArray[currentProblemIndex];

  const onClickCandidate = (i: number, isMultipleAnswer: boolean) => {
    setShuffledExamProblems((prev) => {
      const newShuffledExamProblems = cloneDeep(prev);

      const currentProblem =
        newShuffledExamProblems.exam_problems?.[currentProblemIndex];

      const currentCandidate = currentProblem?.candidates?.[i];

      if (
        currentCandidate?.isAnswer === undefined ||
        currentProblem?.isAnswerMultiple === undefined ||
        currentProblem?.type === undefined ||
        !currentProblem?.candidates
      ) {
        throw new Error("무언가가 잘못되었습니다.");
      }

      if (isMultipleAnswer) {
        // 현재 문제가 다중 선택지이면
        currentCandidate.isAnswer = !currentCandidate.isAnswer;
      } else {
        // 현재 문제가 단일 선택지이면
        
        if (
          currentProblem.candidates.some(
            (candidate) => candidate.isAnswer === true,
          )
        ) {
          // 현재 문제가 단일 선택지이면서 이미 체크된 답이 있으면
          if (
            currentCandidate.id ===
            currentProblem.candidates.find(
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

      return newShuffledExamProblems;
    });
  };

  const onTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setShuffledExamProblems((prev) => {
      const newShuffledExamProblems = cloneDeep(prev);

      const currentProblem =
        newShuffledExamProblems.exam_problems?.[currentProblemIndex];

      if (!currentProblem) {
        throw new Error("무언가가 잘못되었습니다.");
      }

      currentProblem.subAnswer = e.target.value;

      return newShuffledExamProblems;
    });
  };

  usePreventClose();

  useEffect(() => {
    console.log("shuffledExamProblems", shuffledExamProblems);
  }, [shuffledExamProblems]);

  if (!currentShuffledExamProblem) return <div>문제가 없습니다.</div>;

  return (
    <section>
      <div>문제집 이름 : {name}</div>

      <div className="rounded-lg bg-slate-200 p-3">
        <div className="mb-5 text-2xl">
          <span>Q{currentProblemIndex + 1}. </span>
          {currentShuffledExamProblem.question}
        </div>

        {currentShuffledExamProblem.image &&
          isImageUrlObject(currentShuffledExamProblem.image) && (
            <div className="mb-5">
              <Image
                src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${currentShuffledExamProblem.image.url}`}
                width={400}
                height={400}
                alt="이미지"
              />
            </div>
          )}

        {currentShuffledExamProblem.additionalView && (
          <div className="mb-5 border border-black p-3">
            {currentShuffledExamProblem.additionalView}
          </div>
        )}
        {currentShuffledExamProblem.type === "obj" && (
          <>
            {
              <div>
                <ul>
                  {currentShuffledExamProblem.candidates?.map(
                    (candidate, i) => (
                      <li key={i} className="flex">
                        <div
                          className="relative cursor-pointer select-none md:hover:font-bold"
                          onClick={(e) => {
                            onClickCandidate(
                              i,
                              currentShuffledExamProblem.isAnswerMultiple ??
                                false,
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
                    ),
                  )}
                </ul>
              </div>
            }
          </>
        )}

        {currentShuffledExamProblem.type === "sub" && (
          <div>
            <textarea
              className="rounded-md border border-black p-3"
              placeholder="답을 입력하세요."
              onChange={onTextAreaChange}
              value={currentShuffledExamProblem.subAnswer ?? ""}
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
            currentProblemIndex < shuffledExamProblemsArray.length - 1 &&
              setCurrentProblemIndex(currentProblemIndex + 1);
          }}
        >
          다음
        </Button>
      </div>
    </section>
  );
}
