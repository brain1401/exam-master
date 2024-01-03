"use client";

import useUiState from "@/hooks/useUiState";
import { ExamResultsWithCount } from "@/types/problems";
import { Checkbox } from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useState } from "react";
type Props = {
  result: ExamResultsWithCount;
};

export default function ResultsCard({ result }: Props) {
  const formattedDate = new Date(result.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = new Date(result.createdAt).toLocaleTimeString("ko-KR", {
    hour: "numeric",
    minute: "numeric",
  });

  const {
    isDeleteButtonClicked,
    addToDeletedUuid,
    removeToDeletedUuid,
    toDeletedUuid,
  } = useUiState();

  const [isSelected, setIsSelected] = useState<boolean>(
    toDeletedUuid.find((uuid: string) => uuid === result.uuid) ? true : false,
  );


  // toDeletedUuid가 외부에서 변경되었을 때 isSelected 동기화
  useEffect(() => {
    console.log(result.uuid)
    setIsSelected(
      toDeletedUuid.find((uuid: string) => uuid === result.uuid) ? true : false,
    );
  }, [toDeletedUuid, result.uuid]);

  const Card = () => {
    return (
      <div className="flex w-full flex-col items-center">
        <div
          className="mx-auto my-2 flex w-full min-w-[9rem] max-w-[12rem] flex-col items-center justify-center rounded-lg border border-gray-600 p-5 cursor-pointer"
          onClick={() => {
            if (isDeleteButtonClicked) {
              if (isSelected === false) {
                addToDeletedUuid(result.uuid);
              } else {
                removeToDeletedUuid(result.uuid);
              }
              setIsSelected(!isSelected);
            }
          }}
        >
          <h2 className="mb-1 truncate text-center text-xl">
            {result.problemSetName}
          </h2>
          <p className="text-center text-sm font-semibold">{`${result.examProblemResultsCount} 문제`}</p>
          <p className="mx-auto w-fit whitespace-pre-line text-center text-sm text-gray-500">
            {formattedDate}
          </p>
          <p className="mx-auto w-fit text-sm text-gray-500">{formattedTime}</p>
        </div>
        {isDeleteButtonClicked && (
          <Checkbox
            isSelected={isSelected}
            onValueChange={(isSelected) => {
              if (isSelected === true) {
                addToDeletedUuid(result.uuid);
                setIsSelected(isSelected);
              } else {
                removeToDeletedUuid(result.uuid);
                setIsSelected(isSelected);
              }
            }}
          />
        )}
      </div>
    );
  };

  return (
    <>
      {isDeleteButtonClicked ? (
        <Card />
      ) : (
        <Link href={`/result/${result.uuid}`}>
          <Card />
        </Link>
      )}
    </>
  );
}
