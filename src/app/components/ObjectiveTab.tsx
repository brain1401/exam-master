"use client";
import { ChangeEvent, useEffect, useState } from "react";
import AddViewAndPhoto from "./AddViewAndPhoto";
import { isImageFileObject, isImageUrlObject } from "@/service/problems";
import SimpleLabel from "./ui/SimpleLabel";
import { Problem, candidate } from "@/types/problems";
import {
  problemsAtom,
  currentProblemAtom,
  currentProblemCandidatesAtom,
  currentProblemIndexAtom,
  initCurrentProblemAtom,
} from "@/app/jotai/problems";
import { useAtom, useSetAtom } from "jotai";

const candidatePlaceholders = [
  "네가 내 손에 죽고 싶구나?",
  "나는 50점 받았다. 잘난 척 하니 속이 후련하니?",
  "평균 99점이 못 본 거라니. 너 정신이 이상하구나?",
  "다른 데서 그런 식으로 말하면 너는 학교 폭력의 피해자가 될지도 몰라",
];

export default function ObjectiveTab() {
  const [problems, setProblems] = useAtom(problemsAtom);
  const [currentProblem, setCurrentProblem] = useAtom(currentProblemAtom);
  const [currentProblemCandidates, setCurrentProblemCandidates] = useAtom(
    currentProblemCandidatesAtom,
  );
  const [currentProblemIndex, setCurrentProblemIndex] = useAtom(
    currentProblemIndexAtom,
  );
  const initCurrentProblem = useSetAtom(initCurrentProblemAtom);

  const [selectedValue, setSelectedValue] = useState(
    currentProblem?.candidates?.length.toString() ?? "4",
  );
  const [imageURL, setImageURL] = useState<string | null>(null); // 이미지 URL을 관리하는 상태를 추가

  const {
    question,
    additionalView,
    isAdditiondalViewButtonClicked,
    image,
    isImageButtonClicked,
  } = currentProblem ?? {};

  useEffect(() => {
    initCurrentProblem();
  }, [initCurrentProblem]);

  const handleSelectedChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value: selectedValue } = event.target;
    setSelectedValue(selectedValue);

    if (!currentProblemCandidates) throw new Error("무언가가 잘못되었습니다.");

    let newValues = [...currentProblemCandidates];
    const prevLength = newValues.length;

    const selectedIntValue = parseInt(selectedValue);
    if (selectedIntValue < prevLength) {
      //선택지 수가 줄어들 때
      newValues = newValues.slice(0, selectedIntValue);
    } else {
      //선택지 수가 늘어날 때
      for (let i = prevLength; i < selectedIntValue; i++) {
        newValues[i] = {
          id: i,
          text: "",
          isAnswer: false,
        };
      }
    }
    setCurrentProblemCandidates(newValues);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    const index = parseInt(id.split("-")[1]);

    if (!currentProblemCandidates) throw new Error("무언가가 잘못되었습니다.");

    const newCandidates = [...currentProblemCandidates];
    newCandidates[index] = {
      id: index,
      text: value,
      isAnswer: newCandidates[index]?.isAnswer ?? false,
    };

    setCurrentProblemCandidates(newCandidates);
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = event.target;
    const index = parseInt(id.split("-")[1]);
    if (!currentProblemCandidates || !currentProblem)
      throw new Error("무언가가 잘못되었습니다.");

    const changedCandidateCheck = (checked: boolean) => {
      const candidates = {
        id: newCandidates[index]?.id ?? index,
        text: newCandidates[index]?.text ?? "",
        isAnswer: checked,
      };

      return candidates;
    };

    const newCandidates = [...currentProblemCandidates];

    if (currentProblem.isAnswerMultiple === true) {
      newCandidates[index] = changedCandidateCheck(checked);
    } else {
      if (
        currentProblem.candidates?.some(
          (candidate) => candidate.isAnswer === true,
        )
      ) {
        if (
          newCandidates[index]?.text ===
          currentProblem.candidates.find(
            (candidate) => candidate.isAnswer === true,
          )?.text
        ) {
          newCandidates[index] = changedCandidateCheck(checked);
        }
      } else {
        newCandidates[index] = changedCandidateCheck(checked);
      }
    }

    setCurrentProblemCandidates(newCandidates);
  };

  const handleMultipleAnswerCheckboxChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if (!currentProblem) throw new Error("무언가가 잘못되었습니다.");

    const count = currentProblem.candidates?.reduce((acc, cur) => {
      if (cur.isAnswer === true) {
        acc++;
      }
      return acc;
    }, 0);

    if (count === undefined) throw new Error("무언가가 잘못되었습니다.");

    if (event.target.checked === false && count >= 2) {
      // 체크를 해제하려고 하는데 이미 2개 이상의 정답이 선택되어 있으면 경고창을 띄우고 체크를 해제하지 않음
      alert(`이미 ${count}개의 정답이 선택되어 있습니다. 다시 확인해주세요.`);
      return;
    }

    setCurrentProblem({
      isAnswerMultiple: event.target.checked,
    });
  };

  const candidates = Array.from(
    { length: parseInt(selectedValue) },
    (_, index) => candidatePlaceholders[index] ?? "",
  ).map((value, index) => (
    <div key={index} className="my-2 flex flex-col">
      <label
        htmlFor={`candidate-${index}-text`}
        className="text-lg font-semibold"
        onClick={(e) => e.preventDefault()}
      >
        선택지 {index + 1}
      </label>
      <div className="flex items-center justify-start">
        <input
          type="text"
          id={`candidate-${index}-text`}
          value={currentProblemCandidates?.[index]?.text ?? ""}
          className="h-10 w-full rounded-md border border-gray-300 p-2"
          onChange={handleInputChange}
          placeholder={value}
        />
        <label
          htmlFor={`candidate-${index}-checkbox`}
          className="md:text-md text:sm ml-[0.55rem] w-fit  px-1 font-bold md:mx-2 md:w-20 md:p-0"
        >
          정답여부
        </label>
        <input
          type="checkbox"
          id={`candidate-${index}-checkbox`}
          disabled={!Boolean(currentProblemCandidates?.[index]?.text)}
          checked={currentProblemCandidates?.[index]?.isAnswer ?? false}
          onChange={handleCheckboxChange}
        />
      </div>
    </div>
  ));

  // 이미지가 변경될 때마다 이미지 URL을 생성
  useEffect(() => {
    if (isImageFileObject(image)) {
      const objectUrl = URL.createObjectURL(image);
      setImageURL(objectUrl);

      // 컴포넌트가 언마운트 될 때나 이미지가 변경될 때 이미지 URL revoke
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else if (isImageUrlObject(image)) {
      // null 체크와 File 체크 후에 실행
      setImageURL(`${process.env.NEXT_PUBLIC_STRAPI_URL}${image?.url}` ?? "");
    } else {
      setImageURL(null);
    }
  }, [image]);

  useEffect(() => {
    setSelectedValue(currentProblem?.candidates?.length.toString() ?? "4");
  }, [currentProblem?.candidates]);

  return (
    <form
      className="flex flex-col space-y-4 rounded-md border border-gray-500 p-5"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="flex flex-col">
        <SimpleLabel htmlFor="question">문제</SimpleLabel>
        <textarea
          id="question"
          className="h-[6rem] w-full resize-none rounded-md border border-gray-300 p-2"
          placeholder="다음의 친구에게 해 줄 수 있는 말로 적절한 것은?"
          value={question ?? ""}
          onChange={(e) => {
            setProblems((prev) => {
              const newProblems: Partial<Problem>[] = [...prev];
              newProblems[currentProblemIndex] = {
                ...newProblems[currentProblemIndex],
                question: e.target.value,
              };

              return newProblems as NonNullable<Problem>[];
            });
          }}
        />
      </div>

      <AddViewAndPhoto
        additionalView={additionalView ?? ""}
        imageURL={imageURL}
        isAdditiondalViewButtonClicked={isAdditiondalViewButtonClicked ?? false}
        isImageButtonClicked={isImageButtonClicked ?? false}
        setImageURL={setImageURL}
        setProblems={setProblems}
        problemCurrentIndex={currentProblemIndex}
      />

      <div className="flex items-center justify-between">
        <div>
          <SimpleLabel>복수정답</SimpleLabel>
          <input
            type="checkbox"
            className="ml-2 "
            checked={currentProblem?.isAnswerMultiple ?? false}
            onChange={handleMultipleAnswerCheckboxChange}
          />
        </div>
        <div>
          <SimpleLabel htmlFor="answer">선택지 수</SimpleLabel>
          <select
            value={selectedValue}
            onChange={handleSelectedChange}
            className="h-10 rounded-md border border-gray-300 p-2"
          >
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
        </div>
      </div>

      <div className="space-y-4"> {candidates}</div>
    </form>
  );
}
