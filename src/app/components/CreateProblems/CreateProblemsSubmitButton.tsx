"use client";
import { useState } from "react";
import { useAtomValue, useAtom, useSetAtom } from "jotai";
import {
  problemsSetsNameAtom,
  cardsAtom,
  resetCardsAtom,
} from "@/app/jotai/store";
import { isCardEmpty } from "@/service/card";
import { useRouter } from "next/navigation";

export default function CreateProblemsSubmitButton() {
  const [isLoading, setIsLoading] = useState(false);
  const cards = useAtomValue(cardsAtom);
  const resetCards = useSetAtom(resetCardsAtom);
  const [problemSetName, setProblemSetName] = useAtom(problemsSetsNameAtom);
  const router = useRouter();

  const handleSubmit = async () => {
    if (cards.some((card) => isCardEmpty(card))) {
      alert("문제와 선택지를 전부 입력했는지 확인해주세요.");
      return;
    }
    if (problemSetName === "") {
      alert("문제집 이름을 입력해주세요.");
      return;
    }

    if (!confirm("문제집을 제출하시겠습니까?")) return;

    setIsLoading(true); // 로딩 시작

    const formData = new FormData();
    cards.forEach((card, index) => {
      formData.append(`image[${index}]`, card.image as Blob);
      formData.append(`data[${index}]`, JSON.stringify(card));
    });
    formData.append("problemSetName", problemSetName);

    try {
      const response = await fetch("/api/postProblems", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data === "OK") {
        alert("문제집이 성공적으로 등록되었습니다.");
        resetCards();
        setProblemSetName("");
        router.refresh();
      } else {
        alert("문제집 등록에 실패했습니다.");
      }
    }
    catch(err) {
      alert("문제집 등록에 실패했습니다.");
    }
     finally {
      setIsLoading(false); // 로딩 완료
    }
  };

  return (
    <div className="flex justify-center mt-3">
      <button
        className="px-2 py-2 md:px-5 md:py-2 bg-blue-500 rounded-md text-white"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? "제출 중..." : "최종제출"}
      </button>
    </div>
  );
}
