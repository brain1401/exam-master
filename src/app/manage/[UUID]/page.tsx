"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import ProblemsEditor from "@/app/components/ProblemsEditor";
import {
  cardsAtom,
  resetCardsAtom,
  cardsLengthAtom,
} from "@/app/jotai/problems";
import { useAtom, useSetAtom } from "jotai";
import NextOrPrevButtons from "@/app/components/CreateProblems/NextOrPrevButtons";
import CreateProblemsSubmitButton from "@/app/components/CreateProblems/CreateProblemsSubmitButton";
import CurrentCardIndicator from "@/app/components/CreateProblems/CurrentCardIndicator";
import { ClipLoader } from "react-spinners";
type Props = {
  params: {
    UUID: string;
  };
};

export default function EditProblemsByUUID({ params }: Props) {
  const [card, setCard] = useAtom(cardsAtom);
  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<string | null>(null);

  const resetCard = useSetAtom(resetCardsAtom);
  const setCardsLength = useSetAtom(cardsLengthAtom);

  useEffect(() => {
    axios
      .get(`/api/getProblemsByUUID`, {
        params: {
          UUID: params.UUID,
        },
      })
      .then((res) => {
        setCard(res.data);
        setCardsLength(res.data.length);
      })
      .catch((err) => {
        setError(err.message);
        console.log(err.message);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      resetCard();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return <div>존재하지 않는 문서</div>;
  }

  return !loading ? (
    <section className="mt-10">
      <CurrentCardIndicator />
      <ProblemsEditor />
      <NextOrPrevButtons />
      <CreateProblemsSubmitButton />
    </section>
  ) : (
    <ClipLoader size={50} />
  );
}
