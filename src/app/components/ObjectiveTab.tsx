"use client";
import Image from "next/image";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import {
  currentCardAtom,
  currentCardCandidatesAtom,
  currentCardImageAtom,
} from "../jotai/store";
import { useAtom, useSetAtom } from "jotai";

const candidatePlaceholders = [
  "네가 내 손에 죽고 싶구나?",
  "나는 50점 받았다. 잘난 척 하니 속이 후련하니?",
  "평균 99점이 못 본 거라니. 너 정신이 이상하구나?",
  "다른 데서 그런 식으로 말하면 너는 학교 폭력의 피해자가 될지도 몰라",
];

export default function ObjectiveTab() {
  const [currentCard, setCurrentCard] = useAtom(currentCardAtom);
  const {
    question,
    additionalView,
    isAdditiondalViewButtonClicked,
    image,
    isImageButtonClicked,
  } = currentCard;

  const [currentCardCandidates, setCurrentCardCandidates] = useAtom(
    currentCardCandidatesAtom
  );
  const setCurrentCardImage = useSetAtom(currentCardImageAtom);

  const [selectedValue, setSelectedValue] = useState(
    currentCard.candidates?.length.toString() ?? "4"
  );
  const [imageURL, setImageURL] = useState<string | null>(null); // 이미지 URL을 관리하는 상태를 추가

  const handleSelectedChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value: selectedValue } = event.target;
    setSelectedValue(selectedValue);

    let newValues = [...(currentCardCandidates || [])];
    const prevLength = newValues.length;

    const selectedIntValue = parseInt(selectedValue);
    if (selectedIntValue < prevLength) {
      //선택지 수가 줄어들 때
      newValues = newValues.slice(0, selectedIntValue);
    } else {
      //선택지 수가 늘어날 때
      for (let i = prevLength; i < selectedIntValue; i++) {
        newValues[i] = {
          text: "",
          isAnswer: false,
        };
      }
    }
    setCurrentCardCandidates(newValues);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    const index = parseInt(id.split("-")[1]);

    const newCandidates = [...(currentCardCandidates || [])];
    newCandidates[index] = {
      text: value,
      isAnswer: newCandidates[index]?.isAnswer ?? false,
    };

    setCurrentCardCandidates(newCandidates);
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = event.target;
    const index = parseInt(id.split("-")[1]);

    const newCandidates = [...(currentCardCandidates || [])];
    newCandidates[index] = {
      text: newCandidates[index]?.text ?? "",
      isAnswer: checked,
    };

    setCurrentCardCandidates(newCandidates);
  };

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      const MAX_FILE_SIZE = 9 * 1024 * 1024; // 9MB

      if (file) {
        if (file.size > MAX_FILE_SIZE) {
          alert("파일 크기는 9MB를 초과할 수 없습니다.");
          return;
        }

        if (file.type.startsWith("image/")) {
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
      }
    },
    [imageURL, setCurrentCardImage]
  );

  const candidates = Array.from(
    { length: parseInt(selectedValue) },
    (_, index) => candidatePlaceholders[index] ?? ""
  ).map((value, index) => (
    <div key={index} className="flex flex-col my-2">
      <label
        htmlFor={`candidate-${index}-text`}
        className="text-lg font-semibold"
        onClick={(e) => e.preventDefault()}
      >
        선택지 {index + 1}
      </label>
      <div className="flex justify-start items-center">
        <input
          type="text"
          id={`candidate-${index}-text`}
          value={currentCardCandidates?.[index]?.text ?? ""}
          className="w-full h-10 border border-gray-300 rounded-md p-2"
          onChange={handleInputChange}
          placeholder={value}
        />
        <label
          htmlFor={`candidate-${index}-checkbox`}
          className="md:mx-2 ml-[0.55rem] px-1 md:p-0  md:text-md font-bold md:w-20 text:sm w-fit"
        >
          정답여부
        </label>
        <input
          type="checkbox"
          id={`candidate-${index}-checkbox`}
          disabled={!Boolean(currentCardCandidates?.[index]?.text)}
          checked={currentCardCandidates?.[index]?.isAnswer ?? false}
          onChange={handleCheckboxChange}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    if (currentCard.image) {
      const objectUrl = URL.createObjectURL(currentCard.image);
      setImageURL(objectUrl);

      // 컴포넌트가 언마운트 될 때나 currentCard가 변경될 때 이미지 URL revoke
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setImageURL(null);
    }
  }, [currentCard.image]);

  useEffect(() => {
    setSelectedValue(currentCard.candidates?.length.toString() ?? "4");
  }, [currentCard.candidates]);

  useEffect(() => {
    // 컴포넌트가 마운트 될 때 type을 obj로 초기화
    setCurrentCard({
      type: "obj",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form
      className="border border-gray-300 rounded-md p-5 flex flex-col"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="flex flex-col mb-3">
        <label
          htmlFor="question"
          className="text-lg font-semibold mb-2"
          onClick={(e) => e.preventDefault()}
        >
          문제
        </label>
        <textarea
          id="question"
          className="w-full resize-none h-[6rem] border border-gray-300 rounded-md p-2"
          placeholder="다음의 친구에게 해 줄 수 있는 말로 적절한 것은?"
          value={question ?? ""}
          onChange={(e) => {
            setCurrentCard({
              question: e.target.value,
            });
          }}
        />
      </div>
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          className={`${
            isAdditiondalViewButtonClicked
              ? "border border-neutral-500 bg-neutral-500 text-white"
              : "border border-gray-300"
          }  rounded-md px-5 py-2`}
          onClick={() => {
            setCurrentCard({
              isAdditiondalViewButtonClicked: !isAdditiondalViewButtonClicked,
            });
          }}
        >
          보기 추가
        </button>

        <button
          type="button"
          className={`${
            isImageButtonClicked
              ? "border border-neutral-500 bg-neutral-500 text-white"
              : "border border-gray-300"
          }  rounded-md px-5 py-2`}
          onClick={() => {
            setCurrentCard({
              isImageButtonClicked: !isImageButtonClicked,
            });
          }}
        >
          사진 추가
        </button>
      </div>

      {isImageButtonClicked && (
        <div>
          <p
            className="text-lg font-semibold"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            사진
          </p>
          <div className="my-2 flex items-center">
            <input
              type="file"
              id="image"
              accept="image/*"
              className="absolute opacity-0 w-0 h-0"
              onChange={handleImageChange}
            />
            <label
              htmlFor="image"
              className="px-4 py-2 bg-blue-500 text-white cursor-pointer hover:bg-blue-600 rounded-md"
            >
              사진 선택
            </label>
          </div>
          {imageURL && (
            <Image
              src={imageURL ?? ""}
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
            placeholder="나 이번 시험 너무 못 봤어. 평균 99점이 조금 안 되네"
            value={additionalView}
            onChange={(e) => {
              setCurrentCard({
                additionalView: e.target.value,
              });
            }}
          />
        </div>
      )}

      <div className="flex justify-end items-center">
        <label htmlFor="answer" className="text-lg font-semibold mx-2">
          선택지 수
        </label>
        <select
          value={selectedValue}
          onChange={handleSelectedChange}
          className="h-10 border border-gray-300 rounded-md p-2"
        >
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
        </select>
      </div>

      <div>{candidates}</div>
    </form>
  );
}
