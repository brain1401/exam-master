"use client";
import type { Problem } from "@/types/problems";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";
import useProblems from "@/hooks/useProblems";
import { isCardOnBeingWrited } from "@/utils/problems";
import { IoMdSettings } from "react-icons/io";
import { isMobile, isTablet } from "react-device-detect";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { useToast } from "../ui/use-toast";
import { Textarea } from "../ui/textarea";
import { handleEnterKeyPress } from "@/utils/keyboard";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/app/components/ui/hover-card";
import { Info } from "lucide-react";

const BUTTON_CLASSNAMES = "w-[4rem] rounded-lg";
// "ml-2 bg-[#1E90FF] text-white px-[.5rem] text-[.9rem]";

type Props = {
  type: "manage" | "create";
};
export default function ProblemsOption({ type }: Props) {
  const {
    setProblemSetsName,
    localProblemSetsName,
    setLocalProblemSetsName,
    problems,
    setProblems,
    currentProblemIndex,
    setCurrentProblemIndex,
    problemSetIsPublic,
    setProblemSetIsPublic,
    problemLength,
    setProblemLength,
    description,
    timeLimit,
    setTimeLimit,
    setDescription,
  } = useProblems();

  const [isLoading, setIsLoading] = useState(false);
  const [textarea, setTextarea] = useState(description);
  const [timeInput, setTimeInput] = useState(timeLimit || "0");

  const [isProblemSetSettingDialogOpen, setIsProblemSetSettingDialogOpen] =
    useState(false);

  const { toast } = useToast();
  const handleProblemLengthChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setProblemLength(value);
  };

  useEffect(() => {
    if (problemSetIsPublic && type === "create") {
      toast({
        description: "문제집 설정 버튼을 눌러 문제집 설정을 완료해주세요!",
        className: "bg-sky-500 text-white text-[1.5rem]",
        duration: 5000,
      });
    }
  }, [problemSetIsPublic, type, toast]);

  const applyProblemLength = () => {
    const maxProblemLength = parseInt(problemLength); // 입력한 최대 문제 수
    if (maxProblemLength <= 0)
      return alert("최대 문제 수는 0보다 커야 합니다.");

    if (maxProblemLength > problems.length) {
      // 입력한 최대 문제 수가 cards 배열의 현재 길이보다 큰 경우, 나머지 값 만큼 null을 추가.
      setProblems([
        ...problems,
        ...Array<Problem>(maxProblemLength - problems.length).fill(null),
      ]);
    } else if (maxProblemLength < problems.length) {
      // 입력한 최재 문제 수가 cards 배열의 현재 길이보다 작은 경우, 배열의 마지막 항목을 삭제.

      if (
        problems
          .slice(maxProblemLength)
          .some((card) => isCardOnBeingWrited(card))
      ) {
        // 입력 중인 카드가 있을 경우
        const value = confirm(
          `${maxProblemLength}번 문제에서 ${problems.length}번 문제까지의 입력된 데이터가 삭제됩니다. 계속하시겠습니까?`,
        );
        if (value) {
          setProblems(problems.slice(0, maxProblemLength));
          let index = 0;

          if (currentProblemIndex >= maxProblemLength) {
            index = maxProblemLength - 1;
          } else {
            index = currentProblemIndex;
          }

          setCurrentProblemIndex(index);
        } else {
          setProblemLength(problems.length.toString());
        }
      } else {
        setProblems(problems.slice(0, maxProblemLength));
        let index = 0;

        if (currentProblemIndex >= maxProblemLength) {
          index = maxProblemLength - 1;
        } else {
          index = currentProblemIndex;
        }

        setCurrentProblemIndex(index);
      }
    }
  };

  const applyProblemSetName = async () => {
    if (localProblemSetsName === "") {
      alert("문제집 이름은 빈 문자열이 될 수 없습니다.");
      setLocalProblemSetsName("");
      return;
    }

    setIsLoading(true);
    try {
      const result = await fetch(
        `/api/checkProblemSetName?name=${localProblemSetsName.trim()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!result.ok) {
        alert(
          "문제집 이름을 확인하는 중 오류가 발생했습니다. 다시 시도해주세요.",
        );
        return;
      }
      const isAlreadyExistName = await result.json();

      if (isAlreadyExistName) {
        alert("이미 존재하는 문제집 이름입니다.");
        setLocalProblemSetsName("");
        return;
      }

      setProblemSetsName(localProblemSetsName.trim());
      alert("문제집 이름이 적용되었습니다.");
    } catch (err) {
      alert(
        "문제집 이름을 확인하는 중 오류가 발생했습니다. 다시 시도해주세요.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onProblemSetDescriptionOK = () => {
    setDescription(textarea);
    setTimeLimit(timeInput);
    setIsProblemSetSettingDialogOpen(false);
  };

  const onProblemSetDescriptionCancel = () => {
    setTextarea(description);
    setTimeInput(timeLimit);
  };

  return (
    <div className="my-5 flex w-full flex-col gap-2">
      <div className="flex items-center">
        <Label className="mr-2 text-[.9rem]">최대 문제 수</Label>
        <Input
          id="maxIndex"
          textCenter={true}
          allowOnlyNumber
          wrapperClassName=" mr-2"
          inputClassName="w-[3rem] text-[.95rem] h-[2.2rem]"
          value={problemLength}
          onChange={handleProblemLengthChange}
          onKeyDown={(e) => handleEnterKeyPress(e, applyProblemLength)}
        />
        <Button className={BUTTON_CLASSNAMES} onClick={applyProblemLength}>
          확인
        </Button>
      </div>
      <div>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="flex items-center">
            <Label className="mr-2 text-[.9rem]">문제집 이름</Label>
            <Input
              id="problemSetName"
              wrapperClassName="mr-2"
              inputClassName="w-[10rem] h-[2.2rem]"
              value={localProblemSetsName}
              onChange={(e) => setLocalProblemSetsName(e.target.value)}
              onKeyDown={(e) => handleEnterKeyPress(e, applyProblemSetName)}
            />
            <Button
              className={BUTTON_CLASSNAMES}
              onClick={applyProblemSetName}
              isLoading={isLoading}
            >
              {isLoading ? "" : "확인"}
            </Button>
          </div>
          <div className="bottom-0 right-0 top-0 flex flex-col items-end justify-center max-[520px]:left-0 max-[520px]:right-auto max-[520px]:top-full max-[520px]:mt-3 max-[520px]:items-start md:justify-center">
            <div className="relative flex flex-col justify-end">
              <div className="flex items-center justify-center">
                <Switch
                  className="mr-2"
                  checked={problemSetIsPublic}
                  id="problemSetIsPublic"
                  onCheckedChange={() => {
                    setProblemSetIsPublic(!problemSetIsPublic);
                  }}
                />
                <div className="flex items-center justify-center">
                  <Label
                    htmlFor="problemSetIsPublic"
                    className="select-none text-[1rem] peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    문제집 공개
                  </Label>
                </div>
              </div>

              {problemSetIsPublic ? (
                <Dialog
                  open={isProblemSetSettingDialogOpen}
                  onOpenChange={setIsProblemSetSettingDialogOpen}
                >
                  <DialogTrigger
                    className="absolute left-0 right-0 top-full mt-2 flex justify-end max-[520px]:w-[7rem] max-[520px]:justify-start md:block md:w-full"
                    asChild
                  >
                    <div>
                      <Button className="block max-[520px]:hidden">
                        문제집 설정
                      </Button>
                      <Button className="hidden w-fit max-[520px]:block">
                        <IoMdSettings />
                      </Button>
                    </div>
                  </DialogTrigger>
                  <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
                    <DialogHeader className="relative text-start">
                      <div className="absolute right-0 top-[1rem] flex items-center">
                        {isMobile || isTablet ? (
                          <Popover>
                            <PopoverTrigger asChild>
                              <div className="mr-2">
                                <Info className="h-[1.3rem] w-[1.3rem]" />
                              </div>
                            </PopoverTrigger>
                            <PopoverContent>
                              <p className="text-[.8rem]">
                                0으로 설정 시 제한시간이 없는 문제집이 됩니다.
                              </p>
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <div className="mr-2">
                                <Info className="h-[1.3rem] w-[1.3rem]" />
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent>
                              <p className="text-[.8rem]">
                                0으로 설정 시 제한시간이 없는 문제집이 됩니다.
                              </p>
                            </HoverCardContent>
                          </HoverCard>
                        )}

                        <div className="flex items-center justify-center">
                          <Label className="mr-2 text-[.9rem]">제한시간</Label>
                          <Input
                            inputClassName="w-[3rem] h-[2.2rem] text-center"
                            value={timeInput}
                            allowOnlyNumber
                            onChange={(e) => setTimeInput(e.target.value)}
                          />
                          <Label className="ml-2 text-[.9rem]">분</Label>
                        </div>
                      </div>
                      <DialogTitle>{`문제집 ${type === "manage" ? "수정" : "설정"}`}</DialogTitle>
                      <DialogDescription>
                        문제집을 설정해주세요.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col">
                      <Label className="mb-2 ml-[.2rem] mt-2 text-[1rem]">
                        문제집 설명
                      </Label>
                      <Textarea
                        className="resize-none"
                        value={textarea}
                        placeholder="다른 사용자에게 문제집에 대한 설명을 남겨주세요."
                        onChange={(e) => setTextarea(e.target.value)}
                      />
                    </div>

                    <DialogFooter>
                      <Button
                        className="px-6 py-3"
                        onClick={() => onProblemSetDescriptionOK()}
                      >
                        확인
                      </Button>
                      <DialogClose asChild>
                        <Button
                          className="px-6 py-3"
                          variant="outline"
                          onClick={() => onProblemSetDescriptionCancel()}
                        >
                          취소
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
