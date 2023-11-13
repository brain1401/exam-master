"use client";
import { useState } from "react";
import { isProblemEmpty } from "@/service/problems";
import { problemsAtom, problemSetsNameAtom } from "@/jotai/problems";
import { useAtomValue } from "jotai";
import { Button } from "@nextui-org/react";

type Props = {
  uuid: string;
};
export default function ManageProblemSubmitButton({ uuid }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const problems = useAtomValue(problemsAtom);
  const problemSetsName = useAtomValue(problemSetsNameAtom);

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

    // FormData 생성
    const formData = new FormData();
    problems.forEach((problem, index) => {
      formData.append(`image[${index}]`, problem?.image as Blob);
      formData.append(`data[${index}]`, JSON.stringify(problem));
    });
    formData.append("problemSetsName", problemSetsName);
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
    <div className="mt-3 flex justify-center">
      <Button
        onClick={handleSubmit}
        isLoading={isLoading}
        className="w-[7rem] px-8 py-1"
        radius="sm"
        color="primary"
      >
        {isLoading ? "수정 중..." : "수정"}
      </Button>
    </div>
  );
}
