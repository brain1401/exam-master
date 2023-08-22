"use client";
import { useEffect, useState } from "react";
import CreateProblemsCard from "./CreateProblemsCard";
import CardProvider from "@/context/CardContext";
import { isCardEmpty } from "@/service/card";
import { Card } from "../types/card";



export default function CreateProblems() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState<string>("10");
  const [cards, setCards] = useState<Card[]>([
    ...Array(parseInt(maxIndex) || 0).fill({
      type: "obj",
      question: "",
      additionalView: "",
      additiondalViewClicked: false,
      imageButtonClicked: false,
      image: null,
      candidates: [],
      subAnswer: null,
    }),
  ]);

  const showNextCard = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex < parseInt(maxIndex) - 1) {
        return prevIndex + 1;
      } else {
        return prevIndex;
      }
    });
  };

  const showPreviousCard = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex !== 0) {
        return prevIndex - 1;
      } else {
        return prevIndex;
      }
    });
  };

  const handleMaxIndexNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    setMaxIndex(value);
  };

  const handleApplyMaxIndex = () => {
    const newMaxIndex = parseInt(maxIndex, 10);
    if (newMaxIndex > 0) {
      if (newMaxIndex > cards.length) {
        // maxIndex 값이 cards 배열의 현재 길이보다 큰 경우, 배열에 새로운 항목을 추가.
        setCards((prevCards) => [
          ...prevCards,
          ...Array(newMaxIndex - prevCards.length).fill({
            type: "obj",
            question: "",
            additionalView: "",
            additiondalViewClicked: false,
            imageButtonClicked: false,
            image: null,
            candidates: [],
            subAnswer: null,
          }),
        ]);
      } else if (newMaxIndex < cards.length) {
        // maxIndex 값이 cards 배열의 현재 길이보다 작은 경우, 배열의 마지막 항목을 삭제.
        setCards((prevCards) => prevCards.slice(0, newMaxIndex));
      }
    } else {
      alert("최대 문제 수는 0보다 커야 합니다.");
    }
  };

  const handleSubmit = () => {
    if (cards.some((card) => isCardEmpty(card))) {
      alert("문제와 선택지를 전부 입력했는지 확인해주세요.");
    } else {
      //데이터베이스에 저장
    }
  };

  useEffect(() => {
    console.log(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    console.log(cards);
  }, [cards]);

  return (
    <section className="p-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="flex items-center mb-5">
          <label htmlFor="maxIndex" className="mr-2">
            최대 문제 수 :
          </label>
          <input
            id="maxIndex"
            className="border border-black p-1 text-center w-[3rem] rounded-md"
            value={maxIndex}
            onChange={handleMaxIndexNumberChange}
          />
          <button
            className="ml-2 px-5 py-1 border border-black rounded-md hover:bg-slate-300 hover:border-slate-300"
            onClick={handleApplyMaxIndex}
          >
            적용
          </button>
        </div>
      </form>

      <p className="text-center mb-5 text-lg">
        {currentIndex + 1}번째 문제 / 총 {cards.length}개
      </p>

      <CardProvider
        cards={cards}
        currentIndex={currentIndex}
        setCards={setCards}
        setCurrentIndex={setCurrentIndex}
      >
        <CreateProblemsCard />
      </CardProvider>
      <div className="flex justify-center mt-8 gap-5">
        <button
          onClick={showPreviousCard}
          className="px-5 py-2 border border-black rounded-md hover:bg-slate-300 hover:border-slate-300"
        >
          이전
        </button>
        <button
          onClick={showNextCard}
          className="px-5 py-2 border border-black rounded-md hover:bg-slate-300 hover:border-slate-300"
        >
          다음
        </button>
        <button
          className="absolute md:right-[8rem] right-2 px-5 py-2 bg-blue-500 rounded-md text-white "
          onClick={handleSubmit}
        >
          최종제출
        </button>
      </div>
    </section>
  );
}
