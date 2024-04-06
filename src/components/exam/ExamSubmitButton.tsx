import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { PublicExamProblemSet } from "@/types/problems";

type Props = {
  ProblemSet: PublicExamProblemSet | null;
};

export default function ExamSubmitButton({ ProblemSet }: Props) {
  const { data: session } = useSession();

  const user = session?.user;

  const userEmail = user?.email;
  const userName = user?.name;

  return (
    <Button>
      {`문제 제출`}
    </Button>
  );
}
