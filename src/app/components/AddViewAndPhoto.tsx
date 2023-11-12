"use client";
import { Problem } from "@/types/problems";
import Image from "next/image";
import { Textarea, Button } from "@nextui-org/react";

type Props = {
  isAdditiondalViewButtonClicked: boolean;
  isImageButtonClicked: boolean;
  additionalView: string;
  setImageURL: React.Dispatch<React.SetStateAction<string | null>>;
  setProblems: React.Dispatch<React.SetStateAction<Problem[]>>;
  problemCurrentIndex: number;
  imageURL: string | null;
};
export default function AddViewAndPhoto({
  isAdditiondalViewButtonClicked,
  isImageButtonClicked,
  additionalView,
  setProblems,
  imageURL,
  problemCurrentIndex,
  setImageURL,
}: Props) {
  const setCurrentProblem = (newCard: Partial<Problem>) => {
    setProblems((prev) => {
      const newProblems: Partial<Problem>[] = [...prev];
      newProblems[problemCurrentIndex] = {
        ...newProblems[problemCurrentIndex],
        ...newCard,
      };
      return newProblems as NonNullable<Problem>[];
    });
  };

  const setCurrentProblemImage = (newImage: File | null) => {
    setProblems((prev) => {
      const newProblems: Partial<Problem>[] = [...prev];
      newProblems[problemCurrentIndex] = {
        ...newProblems[problemCurrentIndex],
        image: newImage,
      };
      return newProblems as NonNullable<Problem>[];
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setCurrentProblemImage(file);
      } else {
        alert("이미지 파일을 선택해주세요.");
      }
    }
  };

  const getButtonsClassName = (type: "view" | "image") => {
    let value = "";

    const BASIC_CLASS_NAME =
      "rounded-lg border border-gray-300 px-5 py-3";
    const condition =
      type === "view" ? isAdditiondalViewButtonClicked : isImageButtonClicked;

    if (condition) {
      value = `${BASIC_CLASS_NAME} bg-secondary text-main`;
    } else {
      value = `${BASIC_CLASS_NAME}`;
    }

    return value;
  };

  return (
    <>
      <div className="mb-3 flex gap-2">
        <Button
          className={getButtonsClassName("view")}
          onClick={() => {
            if (isAdditiondalViewButtonClicked && additionalView !== "") {
              if (!confirm("보기를 지우시겠습니까?")) return;
              setCurrentProblem({
                additionalView: "",
              });
              setCurrentProblem({
                isAdditiondalViewButtonClicked: !isAdditiondalViewButtonClicked,
              });
            } else {
              setCurrentProblem({
                isAdditiondalViewButtonClicked: !isAdditiondalViewButtonClicked,
              });
            }
          }}
        >
          보기 추가
        </Button>

        <Button
          type="button"
          className={getButtonsClassName("image")}
          onClick={() => {
            if (isImageButtonClicked && imageURL) {
              if (!confirm("이미지를 지우시겠습니까?")) return;

              imageURL && URL.revokeObjectURL(imageURL);
              setImageURL(null);
              setCurrentProblemImage(null);
              setCurrentProblem({
                isImageButtonClicked: !isImageButtonClicked,
              });
            } else {
              setCurrentProblem({
                isImageButtonClicked: !isImageButtonClicked,
              });
            }
          }}
        >
          사진 추가
        </Button>
      </div>

      {(isImageButtonClicked || imageURL) && (
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
              className="absolute h-0 w-0 opacity-0"
              onChange={handleImageChange}
            />
            <label
              htmlFor="image"
              className="cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
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
      {(isAdditiondalViewButtonClicked || additionalView) && (
        <div>
          <label
            htmlFor="additional-info"
            className="mb-3 text-lg font-semibold"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            보기
          </label>
          <Textarea
            id="additional-info"
            placeholder="나 이번 시험 너무 못 봤어. 평균 99점이 조금 안 되네"
            value={additionalView}
            variant="bordered"
            classNames={{
              inputWrapper: "w-full !h-[6rem]",
              input: "text-[1rem]",
              label: "text-md font-semibold text-lg",
            }}
            maxRows={3}
            onChange={(e) => {
              setCurrentProblem({
                additionalView: e.target.value,
              });
            }}
          />
        </div>
      )}
    </>
  );
}
