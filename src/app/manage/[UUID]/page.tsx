"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import ProblemsEditor from "@/app/components/ProblemsEditor";
import NextOrPrevButtons from "@/app/components/CreateProblems/NextOrPrevButtons";
import CurrentProblemIndicator from "@/app/components/CreateProblems/CurrentCardIndicator";
import { ClipLoader } from "react-spinners";
import useProblems from "@/hooks/problems";
import EditProblemsOption from "@/app/components/CreateProblems/EditProblemsOption";
import ManageProblemSubmitButton from "@/app/components/ManageProblemSubmitButton";
type Props = {
  params: {
    UUID: string;
  };
};

export default function EditProblemsByUUID({ params }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    problemCurrentIndex,
    problemSetsName,
    problems,
    resetProblems,
    setProblemCurrentIndex,
    setProblemSetsName,
    setProblems,
  } = useProblems();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/getProblemsByUUID`, {
        params: {
          UUID: params.UUID,
        },
      })
      .then((res) => {
        setProblems(res.data.exam_problems);
        setProblemSetsName(res.data.name);
      })
      .catch((err) => {
        setError(err.message);
        console.log(err.message);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      resetProblems();
    };
  }, [params.UUID, resetProblems, setProblemSetsName, setProblems]);

  if (error) {
    return <div>존재하지 않는 문서</div>;
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <ClipLoader size={100} />
      </div>
    );
  }

  return (
    <section className="mx-auto mt-10 max-w-[80rem] p-3">
      <EditProblemsOption
        problems={problems}
        setProblems={setProblems}
        setProblemCurrentIndex={setProblemCurrentIndex}
        problemSetsName={problemSetsName}
        setProblemSetsName={setProblemSetsName}
      />
      <CurrentProblemIndicator
        problemCurrentIndex={problemCurrentIndex}
        problemsLength={problems.length}
      />
      <ProblemsEditor
        problemCurrentIndex={problemCurrentIndex}
        problems={problems}
        setProblems={setProblems}
      />
      <NextOrPrevButtons
        problemLength={problems.length}
        setCurrentProblemIndex={setProblemCurrentIndex}
      />
      <ManageProblemSubmitButton
        problems={problems}
        problemSetName={problemSetsName}
        uuid={params.UUID}
      />
    </section>
  );
}
