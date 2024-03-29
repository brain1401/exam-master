"use client";

import useUiState from "@/hooks/useUiState";
import { ProblemSet } from "@/types/problems";
import Link from "next/link";
import { Checkbox } from "../ui/checkbox";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/problemGridCard";
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

  const formattedTime = new Date(problemSet.updatedAt).toLocaleTimeString(
    "ko-KR",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );
  const CustomCard = () => (
    <Card>
      <CardHeader>
        <CardTitle>{problemSet.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className=""
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
          <p className="mt-3 text-sm text-gray-500">
            {`${problemSet.examProblemsCount ?? 0}문제`}
          </p>
          <p className="mt-1 text-sm text-gray-500">{formattedDate}</p>
          <p className="text-sm text-gray-500">{formattedTime}</p>
        </div>
      </CardContent>
    </Card>
  );

  return isDeleteButtonClicked ? (
    <>
      <CustomCard />
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
    </>
  ) : (
    <Link
      href={
        type === "manage"
          ? `/manage/${problemSet.uuid}`
          : `/exam/${problemSet.uuid}`
      }
    >
      <CustomCard />
    </Link>
  );
}
