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
} from "../ui/card";
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
      <Card className="h-full w-full cursor-pointer hover:shadow-md">
        <CardHeader>
          <CardTitle className="truncate">{result.problemSetName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className=""
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
            <p className="text-sm font-semibold">{`${result.problemResultsCount} 문제`}</p>
            <p className=" w-fit text-sm text-gray-500">{formattedDate}</p>
            <p className=" w-fit text-sm text-gray-500">{formattedTime}</p>
          </div>
          {isDeleteButtonClicked && (
            <Checkbox
              checked={isSelected}
              onCheckedChange={(selected) => {
                const isChecked =
                  selected === "indeterminate" ? true : selected;
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
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      {isDeleteButtonClicked ? (
        <CustomCard />
      ) : (
        <Link href={`/result/${result.uuid}`}>
          <CustomCard />
        </Link>
      )}
    </>
  );
}
