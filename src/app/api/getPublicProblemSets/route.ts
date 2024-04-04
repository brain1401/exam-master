import { defaultPageSize } from "@/const/pageSize";
import { getPublicProblemSets } from "@/service/problems";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const param = req.nextUrl.searchParams;
  const page = Number(param.get("page"));
  const pageSize = Number(param.get("pageSize"));
  const orderBy = param.get("orderBy");

  if (!page || !pageSize || !orderBy)
    return NextResponse.json(
      { error: "api로 전달된 인수들이 올바르지 않습니다." },
      { status: 400 },
    );

  try {
    const data = await getPublicProblemSets(
      page || 1,
      pageSize || defaultPageSize,
      orderBy as "popular" | "newest",
    );
    return NextResponse.json(data);
  } catch (e) {
    console.log(e);
  }
}
