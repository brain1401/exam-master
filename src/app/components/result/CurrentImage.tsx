"use client";

import useExamProblemResults from "@/hooks/useExamProblemResults";
import Image from "next/image";

export default function CurrentImage() {
  const {
    currentExamProblemResult: { image },
  } = useExamProblemResults();
  
  return (
    <>
      {image && (
        <div className="mb-5">
          <Image
            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${image[0].url}`}
            width={400}
            height={400}
            alt="이미지"
          />
        </div>
      )}
    </>
  );
}
