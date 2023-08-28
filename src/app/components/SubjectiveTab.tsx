"use client";
import Image from "next/image";
import { useCallback, useEffect, useState, useRef } from "react";
import {
  currentCardAtom,
  currentCardCandidatesAtom,
  currentCardImageAtom,
} from "../jotai/store";
import { useAtom, useSetAtom } from "jotai";

export default function SubjectiveTab() {
  const [currentCard, setCurrentCard] = useAtom(currentCardAtom);
  const [currentCardCandidates, setCurrentCardCandidates] = useAtom(
    currentCardCandidatesAtom
  );
  const setCurrentCardImage = useSetAtom(currentCardImageAtom);

  const {
    question,
    additionalView,
    isAdditiondalViewButtonClicked,
    isImageButtonClicked,
    subAnswer,
  } = currentCard;
  const [imageURL, setImageURL] = useState<string | null>(null); // 이미지 URL을 관리하는 상태를 추가

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        if (imageURL) {
          // 이전 이미지 URL 해제
          URL.revokeObjectURL(imageURL);
        }
        const newURL = URL.createObjectURL(file);
        setImageURL(newURL); // 이미지 URL 상태를 업데이트
        setCurrentCardImage(file);
      } else {
        alert("이미지 파일을 선택해주세요.");
      }
    },
    [imageURL, setCurrentCardImage]
  );

  useEffect(() => {
    setCurrentCard({
      type: "sub",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // 컴포넌트가 언마운트 될 때나 이미지가 변경될 때 이미지 URL revoke
    return () => {
      if (imageURL) {
        URL.revokeObjectURL(imageURL);
      }
    };
  }, [imageURL]);

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
      <div className="flex gap-2 mb-3">
        <button
          className={`${
            isAdditiondalViewButtonClicked
              ? "border border-neutral-500 bg-neutral-500 text-white"
              : "border border-gray-300"
          }  rounded-md px-5 py-2`}
          onClick={() => {
            setCurrentCard({
              isAdditiondalViewButtonClicked: !isAdditiondalViewButtonClicked,
            });
            if (isAdditiondalViewButtonClicked === true) {
              setCurrentCard({ additionalView: "" });
            }
          }}
        >
          보기 추가
        </button>

        <button
          className={`${
            isImageButtonClicked
              ? "border border-neutral-500 bg-neutral-500 text-white"
              : "border border-gray-300"
          }  rounded-md px-5 py-2`}
          onClick={() => {
            setCurrentCard({
              isImageButtonClicked: !isImageButtonClicked,
            });
            if (isImageButtonClicked === true) {
              setCurrentCardImage(null);
              URL.revokeObjectURL(imageURL || "");
            }
          }}
        >
          사진 추가
        </button>
      </div>

      {isImageButtonClicked && (
        <div>
          <label
            htmlFor="image"
            className="text-lg font-semibold"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            사진
          </label>
          <div className="my-2 flex justify-center items-center">
            <input
              type="file"
              id="image"
              accept="image/*"
              className="w-full h-10 border border-gray-300 rounded-md p-1"
              onChange={handleImageChange}
            />
          </div>
          {imageURL && (
            <Image
              src={imageURL}
              alt="image"
              width={400}
              height={200}
              className="mb-3"
            />
          )}
        </div>
      )}
      {isAdditiondalViewButtonClicked && (
        <div>
          <label
            htmlFor="additional-info"
            className="text-lg font-semibold mb-3"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            보기
          </label>
          <textarea
            id="additional-info"
            className="w-full resize-none h-[6rem] border border-gray-300 rounded-md p-2 my-2"
            value={additionalView}
            onChange={(e) => {
              setCurrentCard({ additionalView: e.target.value });
            }}
          />
        </div>
      )}

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
