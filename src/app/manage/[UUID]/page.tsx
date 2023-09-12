"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import ProblemsEditor from "@/app/components/ProblemsEditor";
import NextOrPrevButtons from "@/app/components/CreateProblems/NextOrPrevButtons";
import CreateProblemsSubmitButton from "@/app/components/CreateProblems/CreateProblemsSubmitButton";
import CurrentCardIndicator from "@/app/components/CreateProblems/CurrentCardIndicator";
import { ClipLoader } from "react-spinners";
import useProblems from "@/hooks/problems";
type Props = {
  params: {
    UUID: string;
  };
};

export default function EditProblemsByUUID({ params }: Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
    axios
      .get(`/api/getProblemsByUUID`, {
        params: {
          UUID: params.UUID,
        },
      })
      .then((res) => {
        setProblems(res.data);
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

  return !loading ? (
    <section className="mt-10">
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
      <CreateProblemsSubmitButton
        problemSetName={problemSetsName}
        problems={problems}
        setProblemSetsName={setProblemSetsName}
        resetProblems={resetProblems}
      />
    </section>
  ) : (
    <ClipLoader size={50} />
  );
}
