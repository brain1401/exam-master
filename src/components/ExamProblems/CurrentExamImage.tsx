"use client";
import Image from "next/image";
import { isImageUrlObject } from "@/utils/problems";
import useExamProblems from "@/hooks/useExamProblems";

export default function CurrentExamImage() {
  const {
    currentExamProblem: { image },
  } = useExamProblems();
  return (
    <>
      {image && isImageUrlObject(image) && (
        <div className="mb-5">
          <Image
            src={image.url}
            width={400}
            height={400}
            priority
            alt="이미지"
          />
        </div>
      )}
    </>
  );
}
