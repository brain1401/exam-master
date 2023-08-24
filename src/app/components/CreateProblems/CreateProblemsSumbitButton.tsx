"use client";
import { useAtomValue } from "jotai";
import { problemsSetsNameAtom, cardsAtom } from "@/app/jotai/store";
import { isCardEmpty } from "@/service/card";

export default function CreateProblemsSumbitButton() {
  const cards = useAtomValue(cardsAtom);
  const problemSetName = useAtomValue(problemsSetsNameAtom);

  const handleSubmit = () => {
    if (cards.some((card) => isCardEmpty(card))) {
      alert("문제와 선택지를 전부 입력했는지 확인해주세요.");
      return;
    }
    if (problemSetName === "") {
      alert("문제집 이름을 입력해주세요.");
      return;
    }

    alert("제출 완료!");
  };
  return (
    <div className="flex justify-center mt-3">
      <button
        className="px-2 py-2 md:px-5 md:py-2 bg-blue-500 rounded-md text-white "
        onClick={handleSubmit}
      >
        최종제출
      </button>
    </div>
  );
}
