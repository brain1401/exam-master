"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type RevalidateType = Parameters<typeof revalidatePath>;
export async function revalidate(
  path: RevalidateType[0],
  type?: RevalidateType[1],
) {
  revalidatePath(path, type);
}

export async function revalidateAndRedirect(
  redirectPath: string,
  path: RevalidateType[0],
  type?: RevalidateType[1],
) {
  revalidatePath(path, type);
  redirect(redirectPath);
}

export async function revalidateAllPathAction() {
  revalidatePath("/");
}