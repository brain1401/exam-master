import { ProblemSet } from "@/types/card";

type Props = {
  problemSet: ProblemSet;
};

export default function ProblemSet({problemSet} : Props) {
  return (
    <div>
      <h1>{problemSet.name}</h1>
      <p>{problemSet.createdAt}</p>
    </div>

  )
}