import { getExamResults } from "@/service/problems";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { defaultPageSize } from "@/const/pageSize";

export async function GET(req: NextRequest) {
  const session = await getServerSession();

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: "로그인을 해주세요!" }, { status: 401 });
  }

  const params = req.nextUrl.searchParams;
  const page = Number(params.get("page"));
  const pageSize = Number(params.get("pageSize"));

  try {
    if (!session.user?.email) throw new Error("로그인을 해주세요!");

    const results = await getExamResults(
      session.user.email,
      page || 1,
      pageSize || defaultPageSize,
    );

    return NextResponse.json(results);
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }
}
