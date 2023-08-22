"use client";
import Image from "next/image";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useCardContext } from "@/context/CardContext";
import { candidate } from "../types/card";

const candidatePlaceholders = [
  "네가 내 손에 죽고 싶구나?",
  "나는 50점 받았다. 잘난 척 하니 속이 후련하니?",
  "평균 99점이 못 본 거라니. 너 정신이 이상하구나?",
  "다른 데서 그런 식으로 말하면 너는 학교 폭력의 피해자가 될지도 몰라",
];

export default function ObjectiveTab() {
  const { cards, setCards, currentIndex } = useCardContext();
  const [mounted, setMounted] = useState(false);
  const [question, setQuestion] = useState("");
  const [additionalView, setAdditionalView] = useState("");
  const [selectedValue, setSelectedValue] = useState("4");
  const [isAdditionalViewButtonClicked, setIsAdditionalViewButtonClicked] =
    useState(false);
  const [isImageAddButtonClicked, setIsImageAddButtonClicked] = useState(false);
  const [candidateValues, setCandidateValues] = useState<
    Record<string, candidate>
  >({});
  const imageFileRef = useRef<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleSelectedChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value: selectedValue } = event.target;

    setSelectedValue(selectedValue);
    setCandidateValues((prevValues) => {
      const newValues = { ...prevValues };
      const prevLength = Object.keys(newValues).length;
      const keys = Object.keys(newValues);
      const selectedIntValue = parseInt(selectedValue);

      if (selectedIntValue < keys.length) {
        keys.slice(selectedIntValue).forEach((key) => delete newValues[key]);
      } else {
        for (let i = prevLength; i < selectedIntValue; i++) {
          newValues[`candidate-${i + 1}`] = {
            text: "",
            isAnswer: false,
          };
        }
      }
      return newValues;
    });
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    const objkey = id.split("-")[0] + "-" + id.split("-")[1];

    setCandidateValues((prevValues) => ({
      ...prevValues,
      [objkey]: {
        text: value,
        isAnswer: prevValues[objkey]?.isAnswer || false,
      },
    }));
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = event.target;
    const objkey = id.split("-")[0] + "-" + id.split("-")[1];

    setCandidateValues((prevValues) => ({
      ...prevValues,
      [objkey]: {
        text: prevValues[objkey]?.text || "",
        isAnswer: checked,
      },
    }));
  };

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        imageFileRef.current = file;
        setImageUrl(imageUrl);
      } else {
        alert("이미지 파일을 선택해주세요.");
      }
    },
    []
  );
  const candidates = Array.from(
    { length: parseInt(selectedValue) },
    (_, index) => candidatePlaceholders[index]
  ).map((value, index) => (
    <div key={index} className="flex flex-col my-2">
      <label
        htmlFor={`candidate-${index + 1}-text`}
        className="text-lg font-semibold"
        onClick={(e) => e.preventDefault()}
      >
        선택지 {index + 1}
      </label>
      <div className="flex justify-start items-center">
        <input
          type="text"
          id={`candidate-${index + 1}-text`}
          value={candidateValues[`candidate-${index + 1}`]?.text || ""}
          className="w-full h-10 border border-gray-300 rounded-md p-2"
          onChange={handleInputChange}
          placeholder={value}
        />
        <label
          htmlFor={`candidate-${index + 1}-checkbox`}
          className="mx-2 text-md font-bold w-20"
        >
          정답여부
        </label>
        <input
          type="checkbox"
          id={`candidate-${index + 1}-checkbox`}
          disabled={!Boolean(candidateValues[`candidate-${index + 1}`]?.text)}
          checked={candidateValues[`candidate-${index + 1}`]?.isAnswer || false}
          onChange={handleCheckboxChange}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    //컴포넌트가 언마운트 될 때 이미지 URL revoke
    return () => {
      if (imageFileRef.current) {
        URL.revokeObjectURL(URL.createObjectURL(imageFileRef.current));
      }
    };
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    //cards[currentIndex]가 있을 때 해당 값으로 초기화
    if (cards[currentIndex]) {
      const {
        question,
        additionalView,
        image,
        candidates,
        additiondalViewClicked,
        imageButtonClicked,
      } = cards[currentIndex];
      setQuestion(question);
      setAdditionalView(additionalView);
      setImageUrl(image ? URL.createObjectURL(image) : null);
      imageFileRef.current = image || null;
      setSelectedValue(
        candidates?.length.toString() === "0"
          ? "4"
          : candidates?.length.toString() || "4"
      );
      setIsAdditionalViewButtonClicked(additiondalViewClicked);
      setIsImageAddButtonClicked(imageButtonClicked);
      setCandidateValues(
        candidates?.reduce((acc, cur, index) => {
          acc[`candidate-${index + 1}`] = cur;
          return acc;
        }, {} as Record<string, candidate>) || {}
      );
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  useEffect(() => {
    //의존성 배열이 바뀔 때 마다 Cards에 저장
    if (mounted) {
      setCards((prevCards) => {
        const newCards = [...prevCards];
        newCards[currentIndex] = {
          type: "obj",
          question,
          additionalView,
          image: imageFileRef.current,
          additiondalViewClicked: isAdditionalViewButtonClicked,
          imageButtonClicked: isImageAddButtonClicked,
          candidates: Object.values(candidateValues),
          subAnswer: null,
        };
        return newCards;
      });
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    question,
    additionalView,
    imageUrl,
    candidateValues,
    isAdditionalViewButtonClicked,
    isImageAddButtonClicked,
  ]);

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
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value);
          }}
        />
      </div>
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          className={`${
            isAdditionalViewButtonClicked
              ? "border border-neutral-500 bg-neutral-500 text-white"
              : "border border-gray-300"
          }  rounded-md px-5 py-2`}
          onClick={() => {
            setIsAdditionalViewButtonClicked(!isAdditionalViewButtonClicked);
            if (isAdditionalViewButtonClicked === true) {
              setAdditionalView("");
            }
          }}
        >
          보기 추가
        </button>

        <button
          type="button"
          className={`${
            isImageAddButtonClicked
              ? "border border-neutral-500 bg-neutral-500 text-white"
              : "border border-gray-300"
          }  rounded-md px-5 py-2`}
          onClick={() => {
            setIsImageAddButtonClicked(!isImageAddButtonClicked);
          }}
        >
          사진 추가
        </button>
      </div>

      {isImageAddButtonClicked && (
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
          {imageUrl && (
            <Image
              src={imageUrl}
              alt="image"
              width={400}
              height={200}
              className="mb-3"
            />
          )}
        </div>
      )}
      {isAdditionalViewButtonClicked && (
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
              setAdditionalView(e.target.value);
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
