"use client";
import { useAtom, useSetAtom } from "jotai";
import {
  cardsLengthAtom,
  cardsAtom,
  problemsSetsNameAtom,
  currentCardIndexAtom,
} from "@/app/jotai/store";
import { useState, useEffect } from "react";
import { isCardOnBeingWrited } from "@/service/card";

export default function CreateProblemsOption() {
  const [cardsJotai, setCardsJotai] = useAtom(cardsAtom);
  const [cardsLengthJotai, setCardsLengthJotai] = useAtom(cardsLengthAtom);
  const [problemsSetsNameJotai, setProblemsSetsNameJotai] =
    useAtom(problemsSetsNameAtom);
  const setCardIndexJotai = useSetAtom(currentCardIndexAtom);

  const [problemsSetsNameState, setProblemsSetsNameState] = useState<string>(
    problemsSetsNameJotai
  );
  const [cardsLengthState, setCardsLengthState] = useState(cardsLengthJotai);

  const handleCardLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCardsLengthState(value);
  };

  useEffect(() => {
    setProblemsSetsNameState(problemsSetsNameJotai);
  }, [problemsSetsNameJotai]);

  useEffect(() => {
    setCardsLengthState(cardsLengthJotai);
  }, [cardsLengthJotai]);

  const applyCardLangth = () => {
    const maxProblemLength = parseInt(cardsLengthState); // 입력한 최대 문제 수
    if (maxProblemLength <= 0)
      return alert("최대 문제 수는 0보다 커야 합니다.");

    if (maxProblemLength > cardsJotai.length) {
      // 입력한 최대 문제 수가 cards 배열의 현재 길이보다 큰 경우, 배열에 새로운 항목을 추가.
      setCardsJotai((prevCards) => [
        ...prevCards,
        ...Array(maxProblemLength - prevCards.length).fill({
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
      setCardsLengthJotai(maxProblemLength.toString());
    } else if (maxProblemLength < cardsJotai.length) {
      // 입력한 최재 문제 수가 cards 배열의 현재 길이보다 작은 경우, 배열의 마지막 항목을 삭제.

      if (
        cardsJotai
          .slice(maxProblemLength)
          .some((card) => isCardOnBeingWrited(card))
      ) { // 입력 중인 카드가 있을 경우
        const value = confirm(
          `${maxProblemLength}번에서 ${cardsJotai.length}번 문제의 입력된 데이터가 삭제됩니다. 계속하시겠습니까?`
        );
        if (value) {
          setCardsJotai((prevCards) => prevCards.slice(0, maxProblemLength));
          setCardIndexJotai((prev) => {
            if (prev >= maxProblemLength) {
              return maxProblemLength - 1;
            } else {
              return prev;
            }
          });
          setCardsLengthJotai(maxProblemLength.toString());
        }
      } else {
        setCardsJotai((prevCards) => prevCards.slice(0, maxProblemLength));
        setCardIndexJotai((prev) => {
          if (prev >= maxProblemLength) {
            return maxProblemLength - 1;
          } else {
            return prev;
          }
        });
        setCardsLengthJotai(maxProblemLength.toString());
      }
    }
  };

  const applyProblemSetName = async () => {
    if (problemsSetsNameState.trim() === "") {
      alert("문제집 이름은 빈 문자열이 될 수 없습니다.");
      setProblemsSetsNameState("");
      return;
    }

    const result = await fetch(
      `/api/checkProblemSetName?name=${problemsSetsNameState.trim()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const isAlreadyExistName = await result.json();

    if (isAlreadyExistName) {
      alert("이미 존재하는 문제집 이름입니다.");
      setProblemsSetsNameState("");
      setProblemsSetsNameJotai("");
      return;
    }

    setProblemsSetsNameJotai(problemsSetsNameState);
    alert("문제집 이름이 적용되었습니다.");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="flex flex-col gap-2 mb-5">
        <div>
          <label htmlFor="maxIndex" className="ml-5 mr-2">
            최대 문제 수 :
          </label>
          <input
            id="maxIndex"
            className="border border-black p-1 text-center w-[3rem] rounded-md"
            value={cardsLengthState}
            onChange={handleCardLengthChange}
          />
          <button
            className="ml-2 px-5 py-1 border border-black rounded-md hover:bg-slate-300 hover:border-slate-300"
            onClick={applyCardLangth}
          >
            확인
          </button>
        </div>
        <div>
          <label htmlFor="problemSetName" className="ml-5 mr-2">
            문제집 이름 :
          </label>
          <input
            id="problemSetName"
            className="border w-[10rem] border-black p-1 rounded-md"
            value={problemsSetsNameState}
            onChange={(e) => setProblemsSetsNameState(e.target.value)}
          />
          <button
            className="ml-2 px-5 py-1 border border-black rounded-md hover:bg-slate-300 hover:border-slate-300"
            onClick={applyProblemSetName}
          >
            확인
          </button>
        </div>
      </div>
    </form>
  );
}
