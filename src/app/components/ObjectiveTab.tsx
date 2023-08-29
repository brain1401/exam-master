"use client";
import { ChangeEvent, useEffect, useState } from "react";
import {
  currentCardAtom,
  currentCardCandidatesAtom,
  currentCardImageAtom,
  currentCardIndexAtom,
} from "../jotai/store";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import AddViewAndPhoto from "./AddViewAndPhoto";
import { isCardOnBeingWrited } from "@/service/card";

const candidatePlaceholders = [
  "네가 내 손에 죽고 싶구나?",
  "나는 50점 받았다. 잘난 척 하니 속이 후련하니?",
  "평균 99점이 못 본 거라니. 너 정신이 이상하구나?",
  "다른 데서 그런 식으로 말하면 너는 학교 폭력의 피해자가 될지도 몰라",
];

export default function ObjectiveTab() {
  const [currentCard, setCurrentCard] = useAtom(currentCardAtom);
  const currentCardIndex = useAtomValue(currentCardIndexAtom);

  const {
    question,
    additionalView,
    isAdditiondalViewButtonClicked,
    image,
    isImageButtonClicked,
  } = currentCard ?? {};

  const [currentCardCandidates, setCurrentCardCandidates] = useAtom(
    currentCardCandidatesAtom
  );
  const setCurrentCardImage = useSetAtom(currentCardImageAtom);

  const [selectedValue, setSelectedValue] = useState(
    currentCard?.candidates?.length.toString() ?? "4"
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
    if (isCardOnBeingWrited(currentCard)) return;

    setCurrentCard({
      type: "obj",
      question: "",
      additionalView: "",
      isAdditiondalViewButtonClicked: false,
      isImageButtonClicked: false,
      image: null,
      candidates: Array(4).fill({ text: "", isAnswer: false }),
      subAnswer: null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCardIndex]);

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

  useEffect(() => {
    setSelectedValue(currentCard?.candidates?.length.toString() ?? "4");
  }, [currentCard?.candidates]);

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

      <AddViewAndPhoto
        additionalView={additionalView ?? ""}
        imageURL={imageURL}
        isAdditiondalViewButtonClicked={isAdditiondalViewButtonClicked ?? false}
        isImageButtonClicked={isImageButtonClicked ?? false}
        setCurrentCardImage={setCurrentCardImage}
        setImageURL={setImageURL}
        setCurrentCard={setCurrentCard}
      />

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
