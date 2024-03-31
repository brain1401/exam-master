"use client";

import useUiState from "@/hooks/useUiState";
import { ResultWithCount } from "@/types/problems";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardProps,
  CardTitle,
} from "../ui/problemGridCard";
import { useEffect, useState } from "react";
type Props = {
  result: ResultWithCount;
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
    console.log(result.uuid);
    setIsSelected(
      toDeletedUuid.find((uuid: string) => uuid === result.uuid) ? true : false,
    );
  }, [toDeletedUuid, result.uuid]);

  const CustomCard = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{result.problemSetName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-sm">{`${result.problemResultsCount} 문제`}</p>
            <p className=" w-fit text-sm text-gray-500">{formattedDate}</p>
            <p className=" w-fit text-sm text-gray-500">{formattedTime}</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      {isDeleteButtonClicked ? (
        <button
          className="relative flex w-full cursor-pointer flex-col items-center"
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
          <CustomCard />
          {isDeleteButtonClicked && (
            <Checkbox
              className="absolute top-[calc(100%+.8rem)]"
              checked={isSelected}
              onCheckedChange={(isSelected) => {
                const isChecked = isSelected === "indeterminate" ? false : true;
                if (isSelected === true) {
                  addToDeletedUuid(result.uuid);
                  setIsSelected(isChecked);
                } else {
                  removeToDeletedUuid(result.uuid);
                  setIsSelected(isChecked);
                }
              }}
            />
          )}
        </button>
      ) : (
        <Link href={`/result/${result.uuid}`}>
          <CustomCard />
        </Link>
      )}
    </>
  );
}
