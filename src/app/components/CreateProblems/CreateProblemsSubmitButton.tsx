"use client";
import { useState } from "react";
import { isCardEmpty } from "@/service/problems";
import { useRouter } from "next/navigation";
import { Problem } from "@/types/problems";

type Props = {
  problems: Problem[];
  problemSetName: string;
  setProblemSetsName: React.Dispatch<React.SetStateAction<string>>;
  resetProblems: () => void;
};
export default function CreateProblemsSubmitButton({problems, problemSetName, setProblemSetsName, resetProblems}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (problems.some((problem) => isCardEmpty(problem))) {
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
    problems.forEach((problem, index) => {
      formData.append(`image[${index}]`, problem?.image as Blob);
      formData.append(`data[${index}]`, JSON.stringify(problem));
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
        resetProblems();
        setProblemSetsName("");
        router.refresh();
      } else {
        alert("문제집 등록에 실패했습니다.");
      }
    } catch (err) {
      alert("문제집 등록에 실패했습니다.");
    } finally {
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
