import { usePublicProblemExam } from "@/hooks/usePublicProblemExam";
import { Button } from "../ui/button";

export default function PublicProblemExamSubmitButton() {
  const { publicExamProblems } = usePublicProblemExam();

  return <Button>제출하기</Button>;
}
