import { usePublicProblemExam } from "@/hooks/usePublicProblemExam";
import { ExamProblem, PublicExamProblemSet } from "@/types/problems";
import { fetchPublicProblemSetByUUID } from "@/utils/problems";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "@/app/components/ui/progress";
import { Input } from "../ui/input";
import candidateNumber from "@/utils/candidateNumber";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { handleEnterKeyPress } from "@/utils/keyboard";
import checkImage from "../../../public/images/checkBlack.png";
import Image from "next/image";

type Props = {
  problemSetTimeLimit: number;
  publicSetUUID: string;
  userEmail: string | null | undefined;
  userName: string | null | undefined;
  userUUID: string | null | undefined;
};

export default function PublicProblemExamPage({ problemSetTimeLimit }: Props) {
  const {
    isExamStarted,
    currentPublicExamProblem,
    timeLimit,
    publicExamProblems,
    currentPublicExamProblemCandidates,
    setCurrentPublicExamProblem,
    setCurrentPublicExamProblemCandidates,
    setPublicExamProblems,
    setTimeLimit,
    setIsExamStarted,
    currentExamProblemIndex,
    setCurrentExamProblemIndex,
  } = usePublicProblemExam();

  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimeOver, setIsTimeOver] = useState(false);
  const [value, setValue] = useState("1");

  const questionNumber = currentExamProblemIndex + 1;
  const time = Number(timeLimit);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prevTime) => {
        const newTime = prevTime + 0.1;
        if (newTime >= time * 60) {
          setIsTimeOver(true);
          return time * 60;
        }
        return newTime;
      });
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [timeLimit, time]);

  useEffect(() => {
    console.log("isTimeOver :", isTimeOver);
  }, [isTimeOver]);

  useEffect(() => {
    console.log(
      "currentPublicExamProblemCandidates :",
      currentPublicExamProblemCandidates,
    );
  }, [currentPublicExamProblemCandidates]);

  useEffect(() => {
    console.log("publicExamProblems :", publicExamProblems);
  }, [publicExamProblems]);

  useEffect(() => {
    console.log("value :", value);
  }, [value]);

  useEffect(() => {
    return () => {
      setIsExamStarted(false);
    };
  }, [setIsExamStarted]);

  useEffect(() => {
    return () => {
      setTimeLimit(problemSetTimeLimit.toString());
    };
  }, [setTimeLimit, problemSetTimeLimit]);

  useEffect(() => {
    return () => {
      setCurrentExamProblemIndex(0);
    };
  }, [setCurrentExamProblemIndex]);

  const handlePrevQuestion = () => {
    if (currentExamProblemIndex > 0) {
      setCurrentExamProblemIndex(currentExamProblemIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentExamProblemIndex < (publicExamProblems?.length ?? 0) - 1) {
      setCurrentExamProblemIndex(currentExamProblemIndex + 1);
    }
  };

  const handleEndExam = () => {
    setIsExamStarted(false);
    setCurrentExamProblemIndex(0);
    setCurrentPublicExamProblemCandidates(null);
  };

  const handleChangeQuestion = () => {
    const newIndex = parseInt(value, 10) - 1;
    if (newIndex >= 0 && newIndex < (publicExamProblems?.length ?? 0)) {
      setCurrentExamProblemIndex(newIndex);
    }
  };

  const handleCandidateClick = (i: number) => {
    if (!currentPublicExamProblem || !currentPublicExamProblem.candidates) {
      throw new Error("무언가가 잘못되었습니다.");
    }

    const isMultipleAnswer = currentPublicExamProblem.isAnswerMultiple ?? false;

    const newCandidates =
      currentPublicExamProblemCandidates?.map((candidate, index) => {
        if (index === i) {
          return {
            ...candidate,
            isAnswer: !candidate.isAnswer,
          };
        }
        return {
          ...candidate,
          isAnswer: isMultipleAnswer ? candidate.isAnswer : false,
        };
      }) ?? null;

    setCurrentPublicExamProblemCandidates(newCandidates);
  };

  return (
    <section className="flex h-full w-full flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between">
          <h2 className="text-[1.2rem] font-bold md:text-2xl">
            {`총 문제 수 ${publicExamProblems?.length ?? 0}`}
          </h2>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handlePrevQuestion}>
              이전
            </Button>
            <Button onClick={handleNextQuestion}>다음</Button>
          </div>
        </div>
        <div className="my-8">
          <Progress
            value={(elapsedTime / (time * 60)) * 100}
            indicatorClassName={isTimeOver ? "bg-red-500" : ""}
            className={cn("transition-all duration-100")}
          />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{`${questionNumber}. ${currentPublicExamProblem?.question}`}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full space-y-2">
              {currentPublicExamProblem?.candidates?.map((candidate, i) => {
                const isAnswer =
                  currentPublicExamProblemCandidates?.[i]?.isAnswer;
                return (
                  <div key={candidate.id} className="relative">
                    <Image
                      src={checkImage}
                      alt="정답 체크"
                      priority
                      className={cn(
                        "absolute left-[.6rem] top-[-.35rem] h-[2rem] w-[2rem]",
                        isAnswer ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <p
                      className={cn(
                        `w-full cursor-pointer rounded-md border p-2`,
                      )}
                      onClick={() => handleCandidateClick(i)}
                    >
                      {`${candidateNumber(i + 1)} ${candidate.text}`}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <div className="mt-8 flex items-center justify-between">
          <Button variant="outline" onClick={handleEndExam}>
            시험 종료
          </Button>
          <div className="flex items-center gap-4">
            <Label>문제 이동</Label>
            <Input
              value={value}
              inputClassName="w-[3rem] text-center px-0"
              onChange={(e) => setValue(e.target.value)}
              allowOnlyNumber
              onKeyDown={(e) =>
                handleEnterKeyPress(e, () => handleChangeQuestion())
              }
            />
            <Button onClick={handleChangeQuestion}>이동</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
