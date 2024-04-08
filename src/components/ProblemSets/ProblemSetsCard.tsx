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
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import useExamProblems from "@/hooks/useExamProblems";
import { useTimeLimit } from "@/hooks/useTimeLimit";
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

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { setTimeLimit, timeLimit } = useTimeLimit();

  const [isSelected, setIsSelected] = useState<boolean>(
    toDeletedUuid.find((uuid: string) => uuid === problemSet.uuid)
      ? true
      : false,
  );
  const router = useRouter();

  // Dialog가 열렸을 때 해당 카드의 timeLimit 동기화
  useEffect(() => {
    if (isDialogOpen) {
      setTimeLimit(problemSet.timeLimit.toString() || "20");
    }
  }, [isDialogOpen, problemSet.timeLimit, setTimeLimit]);

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
  const CustomCard = (
    <Card>
      <CardHeader>
        <CardTitle>{problemSet.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="">
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
    <button
      className="relative flex w-full cursor-pointer flex-col items-center"
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
      {CustomCard}
      {isDeleteButtonClicked && (
        <Checkbox
          className="absolute top-[calc(100%+.2rem)] md:top-[calc(100%+.8rem)]"
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
    </button>
  ) : type === "manage" ? (
    <Link href={`/manage/${problemSet.uuid}`}>{CustomCard}</Link>
  ) : (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger className="w-full">{CustomCard}</DialogTrigger>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>문제 풀기</DialogTitle>
          <CardDescription>{problemSet.description}</CardDescription>
        </DialogHeader>
        <div className="flex flex-col">
          <Label className="mb-2">문제집 제한 시간 (분)</Label>
          <Input
            allowOnlyNumber
            value={timeLimit}
            onChange={(e) => {
              setTimeLimit(e.target.value);
            }}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">닫기</Button>
          </DialogClose>
          <Button
            onClick={() => {
              router.push(`/exam/${problemSet.uuid}`);
            }}
          >
            문제 풀기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
