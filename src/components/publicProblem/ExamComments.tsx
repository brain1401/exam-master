import { handleEnterKeyPress } from "@/utils/keyboard";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useState } from "react";
import { ProblemSetComment } from "@/types/problems";
import { useToast } from "../ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { TrashIcon } from "lucide-react";
type Props = {
  comments: ProblemSetComment[] | null;
  userUUID: string | null | undefined;
  publicSetUUID: string;
};

export default function ExamComments({
  comments,
  userUUID,
  publicSetUUID,
}: Props) {
  const [comment, setComment] = useState("");
  const { toast } = useToast();
  const { data: session } = useSession();

  const userName = session?.user?.name;

  const queryClient = useQueryClient();

  const { mutate: problemSetCommentsAddMutate } = useMutation({
    mutationFn: (newComment: string) => {
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
    onError: (_error, _newComment, context) => {
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
    onError: (_error, _commentUUID, context) => {
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

    try {
      problemSetCommentsAddMutate(comment);

      setComment("");
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

  return (
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
  );
}
