import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

type Props = {
  pageSize: number;
};
export default function PublicProblemSetsCardSkeleton({ pageSize }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: pageSize }, (_, i) => i).map((_, i) => (
        <Card key={i}>
          <CardContent className="flex flex-col items-start justify-center space-y-2">
            <Skeleton className="mx-auto h-[2rem] w-full max-w-[13rem] text-gray-900 dark:text-gray-50" />
            <div className="mx-auto w-full max-w-[10rem] space-y-1">
              <Skeleton className="mx-auto h-[1.15rem] w-full max-w-[10rem]" />
              <Skeleton className="mx-auto h-[1.15rem] w-full max-w-[10rem]" />
              <Skeleton className="mx-auto h-[1.15rem] w-full max-w-[10rem]" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}