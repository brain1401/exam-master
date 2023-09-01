import { ProblemSet } from "@/types/card";

type Props = {
  problemSet: ProblemSet;
};

export default function ProblemSetCard({problemSet} : Props) {
  return (
    <div className="my-2">
      <h1>{problemSet.name}</h1>
      <p>{problemSet.createdAt}</p>
    </div>

  )
}