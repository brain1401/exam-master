"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import ProblemsEditor from "@/app/components/ProblemsEditor";
import NextOrPrevButtons from "@/app/components/CreateProblems/NextOrPrevButtons";;
import CurrentCardIndicator from "@/app/components/CreateProblems/CurrentCardIndicator";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return <div>존재하지 않는 문서</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={100} />
      </div>
    );
  }

  return (
    <section className="mt-10 p-3 max-w-[80rem] mx-auto">
      <EditProblemsOption
        problems={problems}
        setProblems={setProblems}
        setProblemCurrentIndex={setProblemCurrentIndex}
        problemSetsName={problemSetsName}
        setProblemSetsName={setProblemSetsName}
      />
      <CurrentCardIndicator
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
