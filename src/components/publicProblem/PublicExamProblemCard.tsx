import { handleEnterKeyPress } from "@/utils/keyboard";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardProps,
  CardTitle,
} from "../ui/card";
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
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { Like } from "./PublicProblemExam";
import { ExamProblemSet } from "@/types/problems";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import { useState } from "react";

type Props = {
  problemSet: ExamProblemSet;
  like: Like | null;
  problemSetUUID: string;
  userUUID: string | null | undefined;
  isRandomSelected: boolean;
  setIsRandomSelected: (checked: boolean) => void;
  timeLimit: string;
  setTimeLimit: (value: string) => void;
  setIsExamStarted: (started: boolean) => void;
};

export default function PublicExamProblemCard({
  problemSet,
  like,
  problemSetUUID,
  isRandomSelected,
  timeLimit,
  userUUID,
  setIsRandomSelected,
  setTimeLimit,
  setIsExamStarted,
}: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const { toast } = useToast();

  const { mutate: problemSetLikesMutate } = useMutation({
    mutationFn: (liked: boolean) => {
      return axios.put("/api/handlePublicProblemSetLike", {
        problemSetUUID: problemSetUUID,
        liked,
      });
    },
    onMutate: async (newLiked: boolean) => {
      await queryClient.cancelQueries({
        queryKey: ["publicProblemLikes", problemSetUUID],
      });

      const previousLike = queryClient.getQueryData<Like>([
        "publicProblemLikes",
        problemSetUUID,
      ]);

      queryClient.setQueryData<Like>(
        ["publicProblemLikes", problemSetUUID],
        (old) => {
          if (!old) return { likes: newLiked ? 1 : 0, liked: newLiked };

          return {
            ...old,
            likes: newLiked ? old.likes + 1 : old.likes - 1,
            liked: newLiked,
          };
        },
      );

      return { previousLike };
    },
    onError: (err, newLiked, context) => {
      queryClient.setQueryData<Like>(
        ["publicProblemLikes", problemSetUUID],
        context?.previousLike,
      );
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ["publicProblemLikes", problemSetUUID],
      });
    },
  });

  const onLikeClick = async () => {
    if (!like) return;
    if (!userUUID) {
      toast({
        title: "로그인 후 이용해주세요.",
        variant: "destructive",
      });
      return;
    }
    try {
      problemSetLikesMutate(like.liked);
    } catch (e) {
      console.error(e);
    }
  };

  const handleButtonClick = () => {
    if (problemSet.timeLimit) {
      setIsDialogOpen(true);
    } else {
      setIsExamStarted(true);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="relative">
            <CardTitle className="pr-[3.2rem]">{problemSet?.name}</CardTitle>
            <CardDescription>
              {`${problemSet?.creator ?? ""} 작성 | ${new Date(
                problemSet?.updatedAt ?? "",
              ).toLocaleString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}`}
            </CardDescription>
            <div className="absolute bottom-0 right-0 top-0 flex flex-col items-center justify-center">
              <p className="text-lg font-bold">
                {`${problemSet?.problems.length} 문제`}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 border-y py-4">
          <p className="text-sm/relaxed">
            {problemSet?.description || "만든이가 설명을 제공하지 않았습니다."}
          </p>
          <div className="flex items-center justify-between">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
                <DialogHeader className="text-left">
                  <DialogTitle>제한 시간 설정</DialogTitle>
                  <DialogDescription className="whitespace-pre-wrap">
                    {`시험을 시작하기 전 시험에 제한 시간을 설정하세요.\n문제집 만든이가 설정한 기본 제한 시간은 `}
                    <strong className="dark:text-primary">{`${problemSet?.timeLimit || 20}분`}</strong>
                    {`입니다.`}
                  </DialogDescription>
                </DialogHeader>
                <div className="mb-5 flex flex-col items-center justify-center min-[508px]:mb-0 min-[508px]:gap-y-2 min-[508px]:py-4">
                  <div className="flex flex-col">
                    <Label className="mb-3 block font-bold">
                      제한 시간 (분)
                    </Label>
                    <Input
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(e.target.value)}
                      onKeyDown={async (e) =>
                        handleEnterKeyPress(e, () => {
                          setIsExamStarted(true);
                        })
                      }
                      allowOnlyNumber
                      id="time-limit"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    className="w-full"
                    onClick={() => {
                      setIsExamStarted(true);
                    }}
                  >
                    시작
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-2">
            <Button size="icon" variant="ghost" onClick={onLikeClick}>
              {like?.liked ? (
                <GoHeartFill className="h-6 w-6 text-red-500" />
              ) : (
                <GoHeart className="h-6 w-6" />
              )}
            </Button>
            <span className="text-sm font-medium">{`${like?.likes ?? "0"} 좋아요`}</span>
          </div>
        </CardFooter>
      </Card>
      <div className="mt-5 flex items-center gap-x-4">
        <Button
          className="w-full sm:w-fit"
          onClick={handleButtonClick}
          popoverContent={
            <div className="flex items-center gap-x-2">
              <Label htmlFor="randomSwitch" className="text-center">
                랜덤으로 풀기
              </Label>
              <Switch
                id="randomSwitch"
                checked={isRandomSelected}
                onCheckedChange={(checked) => setIsRandomSelected(checked)}
              />
            </div>
          }
        >
          문제 풀기 시작
        </Button>
      </div>
    </div>
  );
}
