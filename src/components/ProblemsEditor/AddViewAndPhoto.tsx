"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useEffect, useState } from "react";
import useProblems from "@/hooks/useProblems";
import { isImageFileObject, isImageUrlObject } from "@/utils/problems";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};
export default function AddViewAndPhoto({ className }: Props) {
  const [imageURL, setImageURL] = useState<string | null>(null); // 이미지 URL을 관리하는 상태를 추가

  const { currentProblem, setCurrentProblem } = useProblems();

  const {
    additionalView,
    isAdditionalViewButtonClicked,
    isImageButtonClicked,
    image,
  } = currentProblem ?? {};

  // 이미지가 변경될 때마다 이미지 URL을 생성
  useEffect(() => {
    if (isImageFileObject(image)) {
      // image가 null이 아니고 File 객체인 경우
      const objectUrl = URL.createObjectURL(image);
      setImageURL(objectUrl);

      // 컴포넌트가 언마운트 될 때나 이미지가 변경될 때 이미지 URL revoke
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else if (isImageUrlObject(image)) {
      // image가 null이 아니고 URL프로퍼티를 포함한 객체인 경우
      setImageURL(image?.url);
    } else {
      setImageURL(null);
    }
  }, [image]);

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
        setCurrentProblem({ image: file });
      } else {
        alert("이미지 파일을 선택해주세요.");
      }
    }
  };

  const getButtonsClassName = (type: "view" | "image") => {
    let value = "";

    const BASIC_CLASS_NAME =
      "rounded-lg bg-[#d1d5db] text-black border border-gray-300 px-5 py-[1.4rem] hover:text-white";
    const condition =
      type === "view" ? isAdditionalViewButtonClicked : isImageButtonClicked;

    if (condition) {
      value = `${BASIC_CLASS_NAME} bg-[#454655] text-white`;
    } else {
      value = `${BASIC_CLASS_NAME}`;
    }

    return value;
  };

  return (
    <>
      <div className={cn("flex gap-2", className)}>
        <Button
          className={getButtonsClassName("view")}
          onClick={() => {
            if (isAdditionalViewButtonClicked && additionalView !== "") {
              if (!confirm("보기를 지우시겠습니까?")) return;
              setCurrentProblem({
                additionalView: "",
              });
              setCurrentProblem({
                isAdditionalViewButtonClicked: !isAdditionalViewButtonClicked,
              });
            } else {
              setCurrentProblem({
                isAdditionalViewButtonClicked: !isAdditionalViewButtonClicked,
              });
            }
          }}
        >
          보기 추가
        </Button>

        <Button
          className={getButtonsClassName("image")}
          onClick={() => {
            if (isImageButtonClicked && imageURL) {
              if (!confirm("이미지를 지우시겠습니까?")) return;

              imageURL && URL.revokeObjectURL(imageURL);
              setImageURL(null);
              setCurrentProblem({ image: null });
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
        <div className="mt-4">
          <Label
            className="mb-1 block text-[1.1rem]"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            사진
          </Label>
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
              priority
              className="mb-3"
            />
          )}
        </div>
      )}
      {(isAdditionalViewButtonClicked || additionalView) && (
        <div className="mt-4">
          <Label
            htmlFor="additional-info"
            className="mb-1 block text-[1.1rem]"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            보기
          </Label>
          <Textarea
            id="additional-info"
            className="resize-none"
            placeholder="나 이번 시험 너무 못 봤어. 평균 99점이 조금 안 되네"
            value={additionalView}
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
