import ProblemSetsGridLayout from "../layouts/ProblemSetsGridLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

type Props = {
  pageSize: number;
};

export default function ProblemSetsCardSkeleton({ pageSize }: Props) {
  const skeletonArray = Array.from({ length: pageSize }, (_, i) => i);

  return (
    <ProblemSetsGridLayout>
      {skeletonArray.map((_, i) => (
        <li
          key={i}
          className="h-full max-w-[50%] basis-[50%] px-2 md:max-w-[25%] md:basis-[25%]"
        >
          <Card className="h-full w-full">
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-[2rem] w-[10rem]" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-y-[.5rem]">
                <Skeleton className="h-[1rem] w-[10rem]" />
                <Skeleton className="h-[1rem] w-[10rem]" />
              </div>
            </CardContent>
          </Card>
        </li>
      ))}
    </ProblemSetsGridLayout>
  );
}
