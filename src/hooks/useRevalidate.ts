import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function useRevalidation() {
  const router = useRouter();

  const revalidateAllPath = useCallback(() => {
    router.refresh();
  }, [router]);

  const revalidateAllPathAndRedirect = useCallback(
    (redirectPath: string) => {
      router.refresh();
      router.push(redirectPath);
    },
    [router],
  );

  return {
    revalidateAllPath,

    revalidateAllPathAndRedirect,
  };
}
