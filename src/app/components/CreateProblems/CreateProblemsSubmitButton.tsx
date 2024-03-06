"use client";
import { useState } from "react";
import { Button } from "@nextui-org/react";
import axios from "axios";
import useProblems from "@/hooks/useProblems";
import type { PresignedPost } from "@aws-sdk/s3-presigned-post";

import {
  generateFileHash,
  isImageFileObject,
  isProblemEmpty,
} from "@/utils/problems";

export default function CreateProblemsSubmitButton() {
  const { problems, problemSetsName, setProblemSetsName, resetProblems } =
    useProblems();

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

    // try {
    //   const uploadedKeys = await Promise.all(
    //     problems.map(async (problem) => {
    //       if (problem && problem.image && isImageFileObject(problem.image)) {
    //         const hash = await generateFileHash(problem.image);
    //         const key = `${hash}-${problem.image.name}`;
    //         const response = await axios.get<PresignedPost>(
    //           `/api/getPresignedUrl?key=${key}`,
    //         );
    //         const {url, fields} = response.data;
    //         const formData = new FormData();
    //         Object.entries(fields).forEach(([field, value]) => {
    //           formData.append(field, value);
    //         });
    //         formData.append("Content-Type", problem.image.type);
    //         formData.append("file", problem.image);

    //         await axios.post(url, formData);

    //         return key;
    //       }
    //       return null;
    //     }),
    //   );

    //   console.log(uploadedKeys);
    // } catch (err) {
    //   console.error(err);
    // } finally {
    //   setIsLoading(false); // 로딩 완료
    // }

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

      if (data.success === "OK") {
        alert("문제집이 성공적으로 등록되었습니다.");
        resetProblems();
        setProblemSetsName("");
      } else {
        console.error(data.success);
        alert("문제집 등록에 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
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
