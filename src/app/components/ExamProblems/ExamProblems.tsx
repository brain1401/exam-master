"use client";
import usePreventClose from "@/hooks/usePreventClose";
import { useEffect, useState } from "react";
import NextOrPrevButtons from "./ExamProblemsNextOrPrevButtons";
import CurrentExamImage from "./CurrentExamImage";
import CurrentQuestion from "./CurrentQuestion";
import AdditionalView from "./AdditionalView";
import Candidates from "./Candidates";
import SubjectiveAnswerTextarea from "./SubjectiveAnswerTextarea";
import axios from "axios";
import SubmitButton from "./SubmitButton";
import ExamCardLayout from "../layouts/ExamCardLayout";
import useExamProblems from "@/hooks/useExamProblems";
import CustomLoading from "../ui/CustomLoading";
import CurrentProblemIndicator from "./CurrentProblemIndicator";
import Image from "next/image";
import checkImage from "/public/images/checkBlack.png";
import ProblemGridLayout from "../layouts/ProblemGridLayout";
import { isImageUrlObject } from "@/utils/problems";
import { ExamProblemSet } from "@/types/problems";

type Props = {
  UUID: string;
};
export default function ExamProblems({ UUID }: Props) {
  const {
    setExamProblems,
    resetExamProblems,
    currentExamProblem,
    examProblems: { problems },
  } = useExamProblems();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  usePreventClose();

  useEffect(() => {
    setLoading(true);
    axios
      .get<ExamProblemSet>(`/api/getExamProblemsByProblemSetUUID`, {
        params: {
          UUID,
        },
      })
      .then((res) => {
        setExamProblems({
          uuid: res.data.uuid,
          name: res.data.name,
          problems: res.data.problems,
        });
      })
      .catch((err) => {
        setError(err.response?.data.error);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      resetExamProblems();
    };
  }, [UUID, setExamProblems, resetExamProblems]);

  if (error)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center text-2xl">{error}</div>
      </div>
    );

  if (loading) return <CustomLoading className="mt-20" />;

  if (!currentExamProblem) return <div>문제가 없습니다.</div>;

  return (
    <ProblemGridLayout>
      <div>
        {/* preload images */}
        {problems &&
          problems.map((examProblem) => {
            const image = examProblem.image;
            if (image && isImageUrlObject(image)) {
              return (
                <Image
                  key={examProblem.uuid + "preload"}
                  src={image.url}
                  alt="preload image"
                  width={400}
                  height={400}
                  className="hidden"
                  priority
                />
              );
            }
          })}
        {Boolean(checkImage) && (
          <Image
            src={checkImage}
            alt="check image preload"
            priority
            className="hidden"
          />
        )}
      </div>
      <CurrentProblemIndicator />
      <ExamCardLayout>
        <CurrentQuestion />

        <CurrentExamImage />

        <AdditionalView />

        {Boolean(currentExamProblem.type === "obj") && <Candidates />}

        {Boolean(currentExamProblem.type === "sub") && (
          <SubjectiveAnswerTextarea />
        )}
      </ExamCardLayout>

      <div className="flex items-center justify-center">
        <NextOrPrevButtons />
      </div>

      <div className="flex items-center justify-center">
        <SubmitButton />
      </div>
    </ProblemGridLayout>
  );
}
