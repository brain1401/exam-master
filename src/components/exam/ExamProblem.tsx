import type { Candidate, ExamProblem } from "@/types/problems";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import candidateNumber from "@/utils/candidateNumber";
import checkImage from "../../../public/images/checkBlack.png";
import { Textarea } from "../ui/textarea";

type Props = {
  currentProblem: ExamProblem;
  questionNumber: number;
  candidates: Candidate[] | null;
  setCurrentPublicExamProblemCandidates: (
    candidates: Candidate[] | null,
  ) => void;
};

export default function ExamProblem({
  candidates,
  currentProblem,
  questionNumber,
  setCurrentPublicExamProblemCandidates,
}: Props) {
  const handleCandidateClick = (i: number) => {
    if (!currentProblem || !currentProblem.candidates) {
      throw new Error("무언가가 잘못되었습니다.");
    }

    const isMultipleAnswer = currentProblem.isAnswerMultiple ?? false;

    const newCandidates =
      candidates?.map((candidate, index) => {
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

  const objective = currentProblem?.candidates?.map((candidate, i) => {
    const isAnswer = candidates?.[i]?.isAnswer;
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
          className={cn(`w-full cursor-pointer rounded-md border p-2`)}
          onClick={() => handleCandidateClick(i)}
        >
          {`${candidateNumber(i + 1)} ${candidate.text}`}
        </p>
      </div>
    );
  });

  const subjective = (
    <Textarea
      className="h-[2rem] w-full resize-none rounded-md border p-2"
      placeholder="답을 입력해주세요."
    />
  );

  const imageURL = currentProblem.image?.url ?? "";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{`${questionNumber}. ${currentProblem?.question}`}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        <div className="flex w-full items-center justify-center">
          {imageURL ? (
            <Image priority src={imageURL} width={400} height={400} alt="문제 이미지" className="mb-[2rem]" />
          ) : null}
        </div>

        <div className="w-full space-y-2">
          {currentProblem?.type === "obj" ? objective : subjective}
        </div>
      </CardContent>
    </Card>
  );
}
