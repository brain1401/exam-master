import { ProblemSet } from "@/types/card";

type Props = {
  problemSet: ProblemSet;
};

export default function ProblemSetCard({ problemSet }: Props) {
  return (
    <div className="border border-black flex flex-col items-center w-[10rem] my-2 rounded-lg p-5">
      <h1 className="font-bold text-ellipsis overflow-hidden whitespace-nowrap w-full text-center">
        {problemSet.name}
      </h1>
      <p>{problemSet.updatedAt}</p>
    </div>
  );
}
