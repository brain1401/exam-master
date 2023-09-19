"use client";
import { useState } from "react";
import { isProblemEmpty } from "@/service/problems";
import { Problem } from "@/types/problems";

type Props = {
  problems: Problem[];
  problemSetName: string;
  uuid: string;
};
export default function ManageProblemSubmitButton({
  problems,
  problemSetName,
  uuid
}: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (problems.some((problem) => isProblemEmpty(problem))) {
      alert("문제와 선택지를 전부 입력했는지 확인해주세요.");
      return;
    }
    if (problemSetName === "") {
      alert("문제집 이름을 입력해주세요.");
      return;
    }

    if (!confirm("문제집을 제출하시겠습니까?")) return;

    setIsLoading(true); // 로딩 시작

    // FormData 생성
    const formData = new FormData();
    problems.forEach((problem, index) => {
      formData.append(`image[${index}]`, problem?.image as Blob);
      formData.append(`data[${index}]`, JSON.stringify(problem));
    });
    formData.append("problemSetName", problemSetName);
    formData.append("uuid", uuid);
    try {
      const response = await fetch("/api/updateProblems", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data === "OK") {
        alert("문제집이 성공적으로 등록되었습니다.");
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
        {isLoading ? "수정 중..." : "수정"}
      </button>
    </div>
  );
}
