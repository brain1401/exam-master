"use client";
import { useEffect, useState } from "react";
import AddViewAndPhoto from "./AddViewAndPhoto";
import { isCardOnBeingWrited } from "@/service/problems";
import { Problem } from "@/types/problems";

type Props = {
  problems: Problem[];
  setProblems: React.Dispatch<React.SetStateAction<Problem[]>>;
  problemCurrentIndex: number;
};

export default function SubjectiveTab({
  problems,
  setProblems,
  problemCurrentIndex,
}: Props) {
  const currentProblem = problems[problemCurrentIndex];
  const setCurrentProblem = (newCard: Partial<Problem>) => {
    setProblems((prev) => {
      const newProblems: Partial<Problem>[] = [...prev];
      newProblems[problemCurrentIndex] = {
        id: newProblems[problemCurrentIndex]?.id,
        ...newProblems[problemCurrentIndex],
        ...newCard,
      };
      return newProblems as NonNullable<Problem>[];
    });
  };

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
    if (isCardOnBeingWrited(currentProblem)) return;

    setCurrentProblem({
      type: "sub",
      question: "",
      additionalView: "",
      isAdditiondalViewButtonClicked: false,
      isImageButtonClicked: false,
      image: null,
      candidates: null,
      subAnswer: "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problemCurrentIndex]);

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
      className=" border border-gray-300 rounded-md p-5"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="flex flex-col mb-3">
        <label htmlFor="question" className="text-lg font-semibold">
          문제
        </label>
        <textarea
          id="question"
          className="w-full resize-none h-[6rem] border border-gray-300 rounded-md p-2"
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

      <div className="flex flex-col mb-3">
        <label htmlFor="question" className="text-lg font-semibold">
          답
        </label>
        <textarea
          id="question"
          className="w-full resize-none h-[6rem] border border-gray-300 rounded-md p-2"
          value={subAnswer ?? ""}
          onChange={(e) => setCurrentProblem({ subAnswer: e.target.value })}
        />
      </div>
    </form>
  );
}
