"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import ProblemsEditor from "@/app/components/ProblemsEditor/ProblemsEditor";
import NextOrPrevButtons from "@/app/components/CreateProblems/NextOrPrevButtons";
import CurrentProblemIndicator from "@/app/components/CreateProblems/CurrentCardIndicator";
import ProblemsOption from "@/app/components/ProblemsEditor/ProblemsOption";
import ManageProblemSubmitButton from "@/app/components/ManageProblems/ManageProblemSubmitButton";
import CustomLoading from "../ui/CustomLoading";
import ProblemEditorLayout from "../layouts/ProblemEditorLayout";
import useProblems from "@/hooks/useProblems";
import { Button } from "../ui/button";
import { FiShare } from "react-icons/fi";
import Modal from "../ui/Modal";
import ShareLinkWindow from "../ui/ShareLinkWindow";
import { ProblemSetWithName } from "@/types/problems";

type Props = {
  UUID: string;
};

export default function ManageProblemsByUUID({ UUID }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    resetProblems,
    setProblems,
    setProblemSetsName,
    setProblemLength,
    setLocalProblemSetsName,
    setProblemSetIsPublic,
    setCurrentTab,
  } = useProblems();

  useEffect(() => {
    setLoading(true);
    axios
      .get<ProblemSetWithName>(`/api/getProblemsByUUID`, {
        params: {
          UUID,
        },
      })
      .then((res) => {
        setProblems(res.data.problems);
        setProblemSetsName(res.data.name);
        setProblemLength(res.data.problems.length.toString());
        setLocalProblemSetsName(res.data.name);
        setCurrentTab(
          (res.data.problems[0] && res.data.problems[0].type) || "obj",
        );
        setProblemSetIsPublic(res.data.isPublic);
      })
      .catch((err) => {
        setError(err.response?.data.error);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      resetProblems();
    };
  }, [
    UUID,
    resetProblems,
    setProblemSetsName,
    setProblems,
    setLocalProblemSetsName,
    setProblemSetIsPublic,
    setCurrentTab,
    setProblemLength,
  ]);

  if (error) {
    return <h1 className="mt-10 text-center text-2xl">{error}</h1>;
  }

  if (loading) {
    return <CustomLoading className="mt-20" />;
  }

  return (
    <ProblemEditorLayout>
      <div className="relative">
        <ProblemsOption type="manage" />

        <Modal
          Header={<h2 className="text-2xl">링크 공유</h2>}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          className="p-5"
          kind="none"
        >
          <ShareLinkWindow setIsModalOpen={setIsModalOpen} UUID={UUID} />
        </Modal>

        <div className="absolute right-0 top-0">
          <Button
            size="icon"
            variant="outline"
            onClick={() => setIsModalOpen((value) => !value)}
          >
            <FiShare size={20} />
          </Button>
        </div>

        <CurrentProblemIndicator />

        <ProblemsEditor />

        <NextOrPrevButtons />

        <ManageProblemSubmitButton uuid={UUID} />
      </div>
    </ProblemEditorLayout>
  );
}
