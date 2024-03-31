import { revalidate } from "@/app/actions/revalidates";
import { useTransition } from "react";
import { useCallback } from "react";
export default function useRevalidate() {
  const [isPending, startTransition] = useTransition();

  // `startTransition`을 직접 호출할 수 있게 함수를 하나 더 정의합니다.
  const revalidateAllPath = useCallback(() => {
    startTransition(async () => {
      await revalidate("/");
    });
  }, [startTransition]);

  // `revalidateWithTransition` 함수와 `isPending` 상태를 반환합니다.
  return { isPending, revalidateAllPath };
}
