"use client";

import useProblemResults from "@/hooks/useProblemResults";
import Image from "next/image";

export default function CurrentImage() {
  const {
    currentExamProblemResult: { image },
  } = useProblemResults();
  
  return (
    <>
      {image && (
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
