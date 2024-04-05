import ProblemGridCardLayout from "../layouts/ProblemGridCardLayout";
import ProblemSetsGridLayout from "../layouts/ProblemSetsGridLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

type Props = {
  pageSize: number;
};

export default function ProblemSetsCardSkeleton({ pageSize }: Props) {
  const skeletonArray = Array.from({ length: pageSize }, (_, i) => i);

  return (
    <ProblemSetsGridLayout type="other">
      {skeletonArray.map((_, i) => (
        <ProblemGridCardLayout key={i}>
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
        </ProblemGridCardLayout>
      ))}
    </ProblemSetsGridLayout>
  );
}
