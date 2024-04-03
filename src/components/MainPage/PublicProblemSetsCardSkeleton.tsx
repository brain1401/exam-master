import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

type Props = {
  pageSize: number;
};
export default function PublicProblemSetsCardSkeleton({ pageSize }: Props) {
  return (
    <ul className="flex w-full mx-auto min-w-0 max-w-[70rem] flex-1 flex-row flex-wrap gap-y-[1rem]">
      {Array.from({ length: pageSize }, (_, i) => i).map((_, i) => (
        <li
          key={i}
          className="max-w-[50%] basis-[50%] px-2 md:h-auto md:max-w-[25%] md:basis-[25%]"
        >
          <Card>
            <CardContent className="flex flex-col items-start justify-center space-y-2">
              <Skeleton className="mx-auto h-[2rem] w-full max-w-[13rem] text-gray-900 dark:text-gray-50" />
              <div className="mx-auto w-full max-w-[10rem] space-y-1">
                <Skeleton className="mx-auto h-[1.15rem] w-full max-w-[10rem]" />
                <Skeleton className="mx-auto h-[1.15rem] w-full max-w-[10rem]" />
                <Skeleton className="mx-auto h-[1.15rem] w-full max-w-[10rem]" />
              </div>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
