"use client";
import Image from "next/image";
import { isImageUrlObject } from "@/utils/problems";
import { ExamProblem } from "@/types/problems";

type Props = {
  currentExamProblem: ExamProblem;
};
export default function CurrentExamImage({
  currentExamProblem: { image },
}: Props) {
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
