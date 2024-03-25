import { getProblemSets } from "@/service/problems";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession();

  if (!session || !session?.user?.email) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  const param = req.nextUrl.searchParams;
  const page = param.get("page");
  const pageSize = param.get("pageSize");

  try {
    const data = await getProblemSets(
      session?.user?.email,
      page || "1",
      pageSize || "10",
    );
    return NextResponse.json(data);
  } catch (e) {
    console.log(e);
  }
}
