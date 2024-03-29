import ProblemSetsGridLayout from "../layouts/ProblemSetsGridLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";

type Props = {
  pageSize: number;
};

export default function ResultsCardSkeleton({ pageSize }: Props) {
  const skeletonArray = Array.from({ length: pageSize }, (_, i) => i);

  return (
    <ProblemSetsGridLayout>
      {skeletonArray.map((_, i) => (
        <li
          className="h-full max-w-[50%] basis-[50%] px-2 md:max-w-[25%] md:basis-[25%]"
          key={i}
        >
          <Card className="h-full w-full cursor-pointer hover:shadow-md">
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-[2rem] w-[10rem] truncate" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-y-[.2rem]">
                <Skeleton className="h-[1rem] w-[8rem] truncate" />
                <Skeleton className="h-[1rem] w-[8rem] truncate" />
                <Skeleton className="h-[1rem] w-[8rem] truncate" />
              </div>
            </CardContent>
          </Card>
        </li>
      ))}
    </ProblemSetsGridLayout>
  );
}
