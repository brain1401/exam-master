"use client";

import useProblemResults from "@/hooks/useProblemResults";
import Image from "next/image";

export default function CurrentImage() {
  const {
    currentExamResult: { image },
  } = useProblemResults();

  return (
    <>
      {image && (
        <div className="my-[1rem] flex justify-center min-[380px]:my-[1rem] min-[480px]:my-[2rem] min-[530px]:my-[4rem]">
          <div className="relative h-[13rem] w-[30rem] min-[380px]:h-[16rem] min-[430px]:h-[18rem] min-[480px]:h-[19rem] min-[530px]:h-[20rem]">
            <Image
              src={image.url}
              fill
              priority
              alt="이미지"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
