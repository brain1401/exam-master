"use server";

import { revalidatePath } from "next/cache";

type RevalidateType = Parameters<typeof revalidatePath>;
export async function revalidate(
  path: RevalidateType[0],
  type?: RevalidateType[1],
) {
  revalidatePath(path, type);
}
