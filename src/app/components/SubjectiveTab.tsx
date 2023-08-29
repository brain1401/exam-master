"use client";
import { useCallback, useEffect, useState } from "react";
import { currentCardAtom, currentCardImageAtom } from "../jotai/store";
import { useAtom, useSetAtom } from "jotai";
import AddViewAndPhoto from "./AddViewAndPhoto";

export default function SubjectiveTab() {
  const [currentCard, setCurrentCard] = useAtom(currentCardAtom);
  const setCurrentCardImage = useSetAtom(currentCardImageAtom);

  const {
    question,
    additionalView,
    isAdditiondalViewButtonClicked,
    isImageButtonClicked,
    subAnswer,
    image
  } = currentCard;
  const [imageURL, setImageURL] = useState<string | null>(null); // 이미지 URL을 관리하는 상태를 추가

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setImageURL(objectUrl);

      // 컴포넌트가 언마운트 될 때나 이미지가 변경될 때 이미지 URL revoke
      return () => URL.revokeObjectURL(objectUrl);
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
          onChange={(e) => setCurrentCard({ question: e.target.value })}
        />
      </div>
      <AddViewAndPhoto 
        additionalView={additionalView}
        imageURL={imageURL}
        isAdditiondalViewButtonClicked={isAdditiondalViewButtonClicked}
        isImageButtonClicked={isImageButtonClicked}
        setCurrentCardImage={setCurrentCardImage}
        setImageURL={setImageURL}
        setCurrentCard={setCurrentCard}
      />

      <div className="flex flex-col mb-3">
        <label htmlFor="question" className="text-lg font-semibold">
          답
        </label>
        <textarea
          id="question"
          className="w-full resize-none h-[6rem] border border-gray-300 rounded-md p-2"
          value={subAnswer ?? ""}
          onChange={(e) => setCurrentCard({ subAnswer: e.target.value })}
        />
      </div>
    </form>
  );
}
