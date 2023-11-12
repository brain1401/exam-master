"use client";
import { useEffect, useState } from "react";
import AddViewAndPhoto from "./AddViewAndPhoto";
import {
  currentProblemAtom,
  problemsAtom,
  currentProblemIndexAtom,
  initCurrentProblemAtom,
} from "../../jotai/problems";
import { useAtom, useSetAtom, useAtomValue } from "jotai";
import { Textarea } from "@nextui-org/react";

export default function SubjectiveTab() {
  const [currentProblem, setCurrentProblem] = useAtom(currentProblemAtom);
  const setProblems = useSetAtom(problemsAtom);
  const problemCurrentIndex = useAtomValue(currentProblemIndexAtom);
  const initCurrentProblem = useSetAtom(initCurrentProblemAtom);

  const {
    question,
    additionalView,
    isAdditiondalViewButtonClicked,
    isImageButtonClicked,
    subAnswer,
    image,
  } = currentProblem || {};

  const [imageURL, setImageURL] = useState<string | null>(null); // 이미지 URL을 관리하는 상태를 추가

  useEffect(() => {
    initCurrentProblem();
  }, [initCurrentProblem]);

  useEffect(() => {
    if (image instanceof File) {
      const objectUrl = URL.createObjectURL(image);
      setImageURL(objectUrl);

      // 컴포넌트가 언마운트 될 때나 이미지가 변경될 때 이미지 URL revoke
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else if (image && typeof image === "object") {
      // null 체크와 File 체크 후에 실행
      setImageURL(`${process.env.NEXT_PUBLIC_STRAPI_URL}${image?.url}` ?? "");
    } else {
      setImageURL(null);
    }
  }, [image]);

  return (
    <form
      className="flex flex-col space-y-4 rounded-xl bg-gray-100 p-5"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="flex flex-col">
        <Textarea
          id="question"
          classNames={{
            inputWrapper: "w-full !h-[6rem] border-nextUiBorder",
            input: "text-[1rem]",
            label: "text-md font-semibold text-lg",
          }}
          variant="bordered"
          maxRows={3}
          label="문제"
          labelPlacement="outside"
          placeholder="다음의 친구에게 해 줄 수 있는 말로 적절한 것은?"
          value={question}
          onChange={(e) => setCurrentProblem({ question: e.target.value })}
        />
      </div>
      <AddViewAndPhoto
        additionalView={additionalView ?? ""}
        imageURL={imageURL}
        isAdditiondalViewButtonClicked={isAdditiondalViewButtonClicked ?? false}
        isImageButtonClicked={isImageButtonClicked ?? false}
        problemCurrentIndex={problemCurrentIndex}
        setProblems={setProblems}
        setImageURL={setImageURL}
      />

      <div className="mb-3 flex flex-col">
        <Textarea
          id="answer"
          classNames={{
            inputWrapper: "w-full !h-[6rem] border-nextUiBorder",
            input: "text-[1rem]",
            label: "text-md font-semibold text-lg",
          }}
          maxRows={3}
          label="답"
          labelPlacement="outside"
          variant="bordered"
          placeholder="다음의 친구에게 해 줄 수 있는 말로 적절한 것은?"
          value={subAnswer ?? ""}
          onChange={(e) => setCurrentProblem({ subAnswer: e.target.value })}
        />
      </div>
    </form>
  );
}
