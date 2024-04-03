import { revalidate, revalidateAllPathAction, revalidateAndRedirect } from "@/actions/revalidates";
import { redirect } from "next/navigation";
import { useTransition } from "react";
import { useCallback } from "react";

type RevalidateType = Parameters<typeof revalidate>;

export default function useRevalidate() {
  const [isPendinAllPath, startTransitionAllPath] = useTransition();
  const [isPending, startTransitionPath] = useTransition();

  const revalidateAllPath = useCallback(async () => {
    startTransitionAllPath(async () => {
      await revalidateAllPathAction();
    });
  }, [startTransitionAllPath]);

  const revalidatePath = useCallback(
    async (path: RevalidateType[0], type?: RevalidateType[1]) => {
      startTransitionPath(async () => {
        await revalidate(path, type);
      });
    },
    [startTransitionPath],
  );

  const revalidateAllPathAndRedirect = useCallback(
    async (redirectPath: string) => {
      startTransitionAllPath(async () => {
        await revalidateAndRedirect(redirectPath, "/");
      });
    },
    [startTransitionAllPath],
  );

  const revalidatePathAndRedirect = useCallback(
    async ({
      path,
      type,
      redirectPath,
    }: {
      path: RevalidateType[0];
      type?: RevalidateType[1];
      redirectPath: string;
    }) => {
      startTransitionPath(async () => {
        await revalidateAndRedirect(redirectPath, path, type);
      });
    },
    [startTransitionPath],
  );

  return {
    revalidateAllPath,
    revalidatePath,
    revalidateAllPathAndRedirect,
    revalidatePathAndRedirect,
  };
}
