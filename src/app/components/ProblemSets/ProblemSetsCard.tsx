"use client";

import useUiState from "@/hooks/useUiState";
import { ProblemSetResponse } from "@/types/problems";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { Checkbox } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { IsSelected } from "./ProblemSetsGrid";

type Props = {
  type: "manage" | "exam";
  problemSet: ProblemSetResponse;
};

export default function ProblemSetsCard({ type, problemSet }: Props) {
  const {
    isDeleteButtonClicked,
    addToDeletedUuid,
    removeToDeletedUuid,
    toDeletedUuid,
  } = useUiState();

  const [isSelected, setIsSelected] = useState<boolean>(
    toDeletedUuid.find((uuid: string) => uuid === problemSet.UUID)
      ? true
      : false,
  );

  // toDeletedUuid가 외부에서 변경되었을 때 isSelected 동기화
  useEffect(() => {
    setIsSelected(
      toDeletedUuid.find((uuid: string) => uuid === problemSet.UUID)
        ? true
        : false,
    );
  }, [toDeletedUuid, problemSet.UUID]);

  const formattedDate = new Date(problemSet.updatedAt).toLocaleDateString(
    "ko-KR",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  const Card = () => (
    <div className="flex w-full flex-col items-center">
      <div
        className={twMerge(
          `my-2 flex w-full cursor-pointer flex-col items-center rounded-lg border border-gray-300 p-5 transition-shadow duration-200 ease-in hover:shadow-lg`,
          "",
        )}
        onClick={() => {
          if (isDeleteButtonClicked) {
            if (isSelected === false) {
              addToDeletedUuid(problemSet.UUID);
            } else {
              removeToDeletedUuid(problemSet.UUID);
            }
            setIsSelected(!isSelected);
          }
        }}
      >
        <p className="w-full truncate text-center text-lg font-bold text-gray-700">
          {problemSet.name}
        </p>
        <p className="mt-3 text-sm text-gray-500">
          {`${problemSet.examProblemsCount}문제` ?? 0}
        </p>
        <p className="mt-1 text-sm text-gray-500">{formattedDate}</p>
      </div>
      {isDeleteButtonClicked && (
        <Checkbox
          isSelected={isSelected}
          onValueChange={(isSelected) => {
            if (isSelected === true) {
              addToDeletedUuid(problemSet.UUID);
              setIsSelected(isSelected);
            } else {
              removeToDeletedUuid(problemSet.UUID);
              setIsSelected(isSelected);
            }
          }}
        />
      )}
    </div>
  );

  return isDeleteButtonClicked ? (
    <Card />
  ) : (
    <Link
      href={
        type === "manage"
          ? `/manage/${problemSet.UUID}`
          : `/exam/${problemSet.UUID}`
      }
      className="flex w-full justify-center"
    >
      <Card />
    </Link>
  );
}
