import { deleteProblemSet } from "@/service/problems";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: { uuid: string };
};

export async function DELETE(req: NextRequest, { params: { uuid } }: Params) {
  const session = await getServerSession();

  if (!session || !session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await deleteProblemSet(uuid);

  return NextResponse.json(
    { message: result },
    { status: result === "OK" ? 200 : 500 },
  );
}
