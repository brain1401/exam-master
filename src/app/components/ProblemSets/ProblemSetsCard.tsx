"use client";

import useUiState from "@/hooks/useUiState";
import { ProblemSet } from "@/types/problems";
import Link from "next/link";
import { Checkbox } from "../ui/checkbox";
import { useEffect, useState } from "react";

type Props = {
  type: "manage" | "exam";
  problemSet: ProblemSet;
};

export default function ProblemSetsCard({ type, problemSet }: Props) {
  const {
    isDeleteButtonClicked,
    addToDeletedUuid,
    removeToDeletedUuid,
    toDeletedUuid,
  } = useUiState();

  const [isSelected, setIsSelected] = useState<boolean>(
    toDeletedUuid.find((uuid: string) => uuid === problemSet.uuid)
      ? true
      : false,
  );

  // toDeletedUuid가 외부에서 변경되었을 때 isSelected 동기화
  useEffect(() => {
    setIsSelected(
      toDeletedUuid.find((uuid: string) => uuid === problemSet.uuid)
        ? true
        : false,
    );
  }, [toDeletedUuid, problemSet.uuid]);

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
        className="my-2 flex w-full cursor-pointer flex-col items-center rounded-lg border border-gray-300 p-5 transition-shadow duration-200 ease-in hover:shadow-lg"
        onClick={() => {
          if (isDeleteButtonClicked) {
            if (isSelected === false) {
              addToDeletedUuid(problemSet.uuid);
            } else {
              removeToDeletedUuid(problemSet.uuid);
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
          checked={isSelected}
          onCheckedChange={(isSelected) => {
            const isChecked = isSelected === "indeterminate" ? false : true;
            if (isSelected === true) {
              addToDeletedUuid(problemSet.uuid);
              setIsSelected(isChecked);
            } else {
              removeToDeletedUuid(problemSet.uuid);
              setIsSelected(isChecked);
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
          ? `/manage/${problemSet.uuid}`
          : `/exam/${problemSet.uuid}`
      }
      className="flex w-full justify-center"
    >
      <Card />
    </Link>
  );
}
