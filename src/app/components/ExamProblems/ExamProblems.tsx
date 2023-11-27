"use client";
import usePreventClose from "@/hooks/preventClose";
import { useEffect, useState } from "react";
import NextOrPrevButtons from "./ExamProblemsNextOrPrevButtons";
import CurrentExamImage from "./CurrentExamImage";
import CurrentQuestion from "./CurrentQuestion";
import AdditionalView from "./AdditionalView";
import Candidates from "./Candidates";
import SubjectiveAnswerTextarea from "./SubjectiveAnswerTextarea";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import SubmitButton from "./SubmitButton";
import ExamCard from "../ui/ExamCard";
import useExamProblems from "@/hooks/useExamProblems";
import CustomLoading from "../ui/CustomLoading";

type Props = {
  UUID: string;
};
export default function ExamProblems({ UUID }: Props) {
  const { setExamProblems, resetExamProblems, currentExamProblem } =
    useExamProblems();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  usePreventClose();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/getExamProblemsByProblemSetUUID`, {
        params: {
          UUID,
        },
      })
      .then((res) => {
        setExamProblems({
          id: res.data.id,
          name: res.data.name,
          exam_problems: res.data.exam_problems,
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

  if (loading) return <CustomLoading className="mt-20"/>;

  if (!currentExamProblem) return <div>문제가 없습니다.</div>;

  return (
    <section className="mx-auto my-10 max-w-[80rem] p-3">
      <ExamCard>
        <CurrentQuestion />

        <CurrentExamImage />

        <AdditionalView />

        {Boolean(currentExamProblem.type === "obj") && <Candidates />}

        {Boolean(currentExamProblem.type === "sub") && (
          <SubjectiveAnswerTextarea />
        )}
      </ExamCard>

      <NextOrPrevButtons />

      <SubmitButton />
    </section>
  );
}
