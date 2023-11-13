"use client";
import { useState } from "react";
import { isProblemEmpty } from "@/service/problems";
import {
  problemsAtom,
  problemSetsNameAtom,
  resetProblemsAtom,
} from "@/jotai/problems";
import { useAtom, useSetAtom } from "jotai";
import { Button } from "@nextui-org/react";

export default function CreateProblemsSubmitButton() {
  const [problems, setProblems] = useAtom(problemsAtom);
  const [problemSetsName, setProblemSetsName] = useAtom(problemSetsNameAtom);
  const resetProblems = useSetAtom(resetProblemsAtom);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (problems.some((problem) => isProblemEmpty(problem))) {
      alert("문제와 선택지를 전부 입력했는지 확인해주세요.");
      return;
    }
    if (problemSetsName === "") {
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
    formData.append("problemSetsName", problemSetsName);

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
    <div className="mt-3 flex justify-center">
      <Button
        radius="sm"
        onClick={handleSubmit}
        isLoading={isLoading}
        className="w-[7rem] px-8 py-1"
        color="primary"
      >
        {isLoading ? "제출 중..." : "최종제출"}
      </Button>
    </div>
  );
}
