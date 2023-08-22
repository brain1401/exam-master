"use client";
import { useCardContext } from "@/context/CardContext";
import Image from "next/image";
import { useCallback, useEffect, useState, useRef } from "react";

export default function SubjectiveTab() {
  const { cards, setCards, currentIndex } = useCardContext();
  const [mounted, setMounted] = useState(false);
  const [question, setQuestion] = useState("");
  const [additionalView, setAdditionalView] = useState("");
  const [answer, setAnswer] = useState("");
  const [isAdditionalViewButtonClicked, setIsAdditionalViewButtonClicked] =
    useState(false);
  const [isImageAddButtonClicked, setIsImageAddButtonClicked] = useState(false);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const imageFileRef = useRef<File | null>(null);

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        imageFileRef.current = file;
        setImageUrl(URL.createObjectURL(file));
      } else {
        alert("이미지 파일을 선택해주세요.");
      }
    },
    []
  );

  useEffect(() => {
    //컴포넌트가 마운트 될 때 mounted를 true로 설정
    setMounted(true);
  }, []);

  useEffect(() => {
    //컴포넌트가 언마운트 될 때 이미지 URL을 revoke
    return () => {
      if (imageFileRef.current) {
        URL.revokeObjectURL(URL.createObjectURL(imageFileRef.current));
      }
    };
  }, []);

  useEffect(() => {
    //cards[currentIndex]에 값이 있을 때 해당 값으로 초기값 설정
    if (cards[currentIndex]) {
      const {
        question,
        additionalView,
        subAnswer,
        image,
        additiondalViewClicked,
        imageButtonClicked,
      } = cards[currentIndex];
      setQuestion(question);
      setAdditionalView(additionalView);
      setAnswer(subAnswer || "");
      setImageUrl(image ? URL.createObjectURL(image) : null);
      imageFileRef.current = image || null;
      setIsAdditionalViewButtonClicked(additiondalViewClicked);
      setIsImageAddButtonClicked(imageButtonClicked);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  useEffect(() => {
    //의존성 배열이 바뀔 때 마다 Cards를 업데이트
    if (mounted) {
      setCards((prevCards) => {
        const newCards = [...prevCards];
        newCards[currentIndex] = {
          type: "sub",
          question,
          additionalView,
          image: imageFileRef.current,
          additiondalViewClicked: isAdditionalViewButtonClicked,
          imageButtonClicked: isImageAddButtonClicked,
          subAnswer: answer,
          candidates: null,
        };
        return newCards;
      });
    }
    
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    question,
    additionalView,
    imageUrl,
    answer,
    isAdditionalViewButtonClicked,
    isImageAddButtonClicked,
  ]);

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
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>
      <div className="flex gap-2 mb-3">
        <button
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
            value={additionalView}
            onChange={(e) => {
              setAdditionalView(e.target.value);
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
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
      </div>
    </form>
  );
}
