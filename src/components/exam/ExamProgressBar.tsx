import { Progress } from "@/app/components/ui/progress";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

type Props = {
  timeLimit: number;
  isTimeOver: boolean;
  setIsTimeOver: (isTimeOver: boolean) => void;
};

export default function ExamProgressBar({
  isTimeOver,
  timeLimit,
  setIsTimeOver,
}: Props) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const startTime = Date.now();

    const timer = () => {
      const currentTime = Date.now();
      const elapsed = (currentTime - startTime) / 1000;
      setElapsedTime(elapsed);

      if (elapsed >= timeLimit * 60) {
        setIsTimeOver(true);
      } else {
        timeoutRef.current = setTimeout(timer, 100);
      }
    };

    timeoutRef.current = setTimeout(timer, 100);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [timeLimit, setIsTimeOver]);

  const remainingTime = timeLimit * 60 - elapsedTime;
  const minutes = Math.floor(remainingTime / 60);
  const seconds = Math.floor(remainingTime % 60);

  return (
    <div className="my-8">
      <div className="">
        {isTimeOver
          ? "시간 초과"
          : `남은 시간 : ${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}
      </div>
      <Progress
        value={(elapsedTime / (timeLimit * 60)) * 100}
        indicatorClassName={isTimeOver ? "bg-red-500" : ""}
        className={cn("transition-all duration-100")}
      ></Progress>
    </div>
  );
}