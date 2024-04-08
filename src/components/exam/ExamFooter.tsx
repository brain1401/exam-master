import { Button } from "../ui/button";
import { ExamProblemSet } from "@/types/problems";
import ExamSubmitButton from "./ExamSubmitButton";
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
type Props = {
  problemSet: ExamProblemSet | null;
};

export default function ExamFooter({ problemSet }: Props) {
  const router = useRouter();

  const handleEndExam = () => {
    router.push("/");
  };

  return (
    <div className="mt-8 flex flex-col-reverse gap-y-2 sm:flex-row sm:items-center sm:justify-between sm:gap-y-0">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive">시험 중단</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>시험 중단</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <p>
            정말로 시험을 중단하시겠습니까? 시험을 중단하면 시험 결과가 저장되지
            않습니다.
          </p>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button onClick={handleEndExam}>중단</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ExamSubmitButton
        problemSet={problemSet}
        className="mt-0 w-full sm:w-auto"
      />
    </div>
  );
}
