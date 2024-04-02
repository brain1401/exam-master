"use client";
import { GoHeartFill } from "react-icons/go";
import { GoHeart } from "react-icons/go";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { TrashIcon } from "lucide-react";
import { Textarea } from "../../components/ui/textarea";
import type { ProblemSetComment, PublicExamProblemSet } from "@/types/problems";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  fetchPublicProblemLikes,
  fetchPublicProblemSetByUUID,
  fetchPublicProblemSetComments,
} from "@/utils/problems";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";
import { handleEnterKeyPress } from "@/utils/keyboard";

type Props = {
  publicSetUUID: string;
  userEmail: string | null | undefined;
  userName: string | null | undefined;
  userUUID: string | null | undefined;
};

export type Like = { likes: number; liked: boolean };

export default function PublicProblemExam({
  publicSetUUID,
  userEmail,
  userName,
  userUUID,
}: Props) {
  const [comment, setComment] = useState("");

  const queryClient = useQueryClient();

  const { toast } = useToast();

  const { data: publicProblemSet } = useQuery<PublicExamProblemSet | null>({
    queryKey: ["publicProblemSet", publicSetUUID],
    queryFn: () => fetchPublicProblemSetByUUID(publicSetUUID),
  });

  const { data: comments } = useQuery<ProblemSetComment[] | null>({
    queryKey: ["problemSetComments", publicSetUUID],
    queryFn: () => fetchPublicProblemSetComments(publicSetUUID),
  });

  const { data: like } = useQuery<Like | null>({
    queryKey: ["publicProblemLikes", publicSetUUID, userEmail],
    queryFn: () => fetchPublicProblemLikes(publicSetUUID),
  });

  const { mutate: problemSetLikesMutate } = useMutation({
    mutationFn: (liked: boolean) => {
      return axios.put("/api/handlePublicProblemSetLike", {
        problemSetUUID: publicSetUUID,
        liked,
      });
    },
    onMutate: async (newLiked: boolean) => {
      await queryClient.cancelQueries({
        queryKey: ["publicProblemLikes", publicSetUUID],
      });

      const previousLike = queryClient.getQueryData<Like>([
        "publicProblemLikes",
        publicSetUUID,
      ]);

      queryClient.setQueryData<Like>(
        ["publicProblemLikes", publicSetUUID],
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
        ["publicProblemLikes", publicSetUUID],
        context?.previousLike,
      );
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ["publicProblemLikes", publicSetUUID],
      });
    },
  });

  const { mutate: problemSetCommentsAddMutate } = useMutation({
    mutationFn: (newComment: string) => {
      console.log(publicSetUUID);
      return axios.post("/api/postProblemSetComment", {
        problemSetUUID: publicSetUUID,
        comment: newComment,
      });
    },
    onMutate: async (newComment: string) => {
      await queryClient.cancelQueries({
        queryKey: ["problemSetComments", publicSetUUID],
      });

      const previousComment = queryClient.getQueryData<ProblemSetComment[]>([
        "problemSetComments",
        publicSetUUID,
      ]);

      queryClient.setQueryData<ProblemSetComment[]>(
        ["problemSetComments", publicSetUUID],
        (old) => {
          const tempComment = {
            uuid: "temp",
            userName: userName ?? "",
            userUUID: userUUID ?? "",
            content: newComment,
            createdAt: new Date(),
          };

          if (!old) {
            return [tempComment];
          }
          return [...old, tempComment].sort((a, b) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
        },
      );
      return { previousComment };
    },
    onError: (err, newComment, context) => {
      queryClient.setQueryData<ProblemSetComment[]>(
        ["problemSetComments", publicSetUUID],
        context?.previousComment,
      );
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ["problemSetComments", publicSetUUID],
      });
    },
  });

  const { mutate: problemSetCommentsDeleteMutate } = useMutation({
    mutationFn: (commentUUID: string) => {
      return axios.delete("/api/deletePublicProblemComment", {
        params: {
          commentUUID,
        },
      });
    },
    onMutate: async (commentUUID: string) => {
      await queryClient.cancelQueries({
        queryKey: ["problemSetComments", publicSetUUID],
      });

      const previousComment = queryClient.getQueryData<ProblemSetComment[]>([
        "problemSetComments",
        publicSetUUID,
      ]);

      queryClient.setQueryData<ProblemSetComment[]>(
        ["problemSetComments", publicSetUUID],
        (old) => {
          return old?.filter((comment) => comment.uuid !== commentUUID);
        },
      );

      return { previousComment };
    },
    onError: (err, commentUUID, context) => {
      queryClient.setQueryData<ProblemSetComment[]>(
        ["problemSetComments", publicSetUUID],
        context?.previousComment,
      );
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ["problemSetComments", publicSetUUID],
      });
    },
  });

  const onCommentSubmit = async () => {
    if (!userUUID) {
      toast({
        title: "로그인 후 이용해주세요.",
        variant: "destructive",
      });
      return;
    }
    if (comment.trim().length === 0) {
      alert("댓글을 입력하세요.");
      return;
    }

    // 댓글 작성 로직
    try {
      problemSetCommentsAddMutate(comment);

      setComment("");
    } catch (e) {
      console.error(e);
    }
  };

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

  const onDeleteComment = async (
    commentUserUUID: string,
    commentUUID: string,
  ) => {
    if (commentUserUUID === userUUID) {
      try {
        problemSetCommentsDeleteMutate(commentUUID);
      } catch (e) {
        console.error(e);
      }
    } else if (!userUUID) {
      toast({
        title: "로그인 후 이용해주세요.",
        variant: "destructive",
      });
      return;
    } else {
      toast({
        title: "본인의 댓글만 삭제할 수 있습니다.",
        variant: "destructive",
      });
      return;
    }
  };

  useEffect(() => {
    console.log(like);
  }, [like]);

  return (
    <div className="px-3 py-3 pt-10">
      <div className="mx-auto max-w-[50rem]">
        <Card>
          <CardHeader>
            <div className="relative">
              <CardTitle className="pr-[3.2rem]">
                {publicProblemSet?.name}
              </CardTitle>
              <CardDescription>{`${publicProblemSet?.creator ?? ""} 작성 | ${new Date(
                publicProblemSet?.updatedAt ?? "",
              ).toLocaleString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}`}</CardDescription>
              <p className="absolute bottom-0 right-0 top-0 text-lg font-bold">
                {`${publicProblemSet?.problems.length} 문제`}
              </p>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 border-y py-4">
            <p className="text-sm/relaxed">
              {publicProblemSet?.description ||
                "만든이가 설명을 제공하지 않았습니다."}
            </p>
            <div className="flex items-center justify-between">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg">문제 풀기 시작</Button>
                </DialogTrigger>
                <DialogContent
                  className="sm:max-w-[425px]"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                >
                  <DialogHeader>
                    <DialogTitle>제한 시간 설정</DialogTitle>
                    <DialogDescription>
                      시험에 제한 시간을 설정하세요.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center justify-center gap-4 py-4">
                    <div>
                      <Label className="mb-3 block font-bold">
                        제한 시간 (분)
                      </Label>
                      <Input
                        onKeyDown={async (e) =>
                          handleEnterKeyPress(e, () => {})
                        }
                        className="w-[10rem]"
                        id="time-limit"
                        type="number"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">저장</Button>
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
        <div className="mt-8">
          <h2 className="text-xl font-semibold">{`댓글 (${comments?.length})`}</h2>
          <div className="mt-4">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="resize-none"
              placeholder="댓글을 입력하세요."
              onKeyDown={(e) => handleEnterKeyPress(e, onCommentSubmit)}
            />
            <div className="mt-2 flex justify-between">
              <Button onClick={onCommentSubmit}>댓글 작성</Button>
            </div>
          </div>

          {comments && comments.length > 0 && (
            <div className="mt-4 space-y-4">
              {comments.map((comment) => (
                <div
                  className="border-b border-gray-200 pb-4 dark:border-gray-800"
                  key={comment.uuid}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{comment.userName}</h3>
                      <p className="text-[1rem] dark:text-gray-400">
                        {comment.content}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleString("ko-KR", {
                          year: "numeric",
                          month: "long",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <Button
                      className="h-8 w-8"
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        onDeleteComment(comment.userUUID, comment.uuid)
                      }
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
