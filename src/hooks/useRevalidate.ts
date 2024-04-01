import { revalidate } from "@/app/actions/revalidates";
import { useTransition } from "react";
import { useCallback } from "react";

type RevalidateType = Parameters<typeof revalidate>;

export default function useRevalidate() {
  const [isPending, startTransition] = useTransition();

  const revalidateAllPath = useCallback(() => {
    startTransition(async () => {
      await revalidate("/");
    });
  }, [startTransition]);

  const revalidatePath = useCallback(
    (path: RevalidateType[0], type?: RevalidateType[1]) => {
      startTransition(async () => {
        await revalidate(path, type);
      });
    },
    [startTransition],
  );

  return { isPending, revalidateAllPath, revalidatePath };
}
