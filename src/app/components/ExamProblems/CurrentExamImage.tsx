"use client";
import { currentExamProblemAtom } from "@/jotai/examProblems";
import { useAtomValue } from "jotai";
import Image from "next/image";
import { isImageUrlObject } from "@/service/problems";


export default function CurrentExamImage() {
  const currentExamProblem = useAtomValue(currentExamProblemAtom);


  return (
    <>
      {currentExamProblem?.image &&
        isImageUrlObject(currentExamProblem.image) && (
          <div className="mb-5">
            <Image
              src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${currentExamProblem.image.url}`}
              width={400}
              height={400}
              alt="이미지"
            />
          </div>
        )}
    </>
  );
}