import { defaultPageSize } from "@/const/pageSize";
import { getPublicProblemSetsByName } from "@/service/problems";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const param = req.nextUrl.searchParams;

  const name = param.get("name");
  const page = Number(param.get("page"));
  const pageSize = Number(param.get("pageSize"));
  const orderBy = param.get("orderBy");

  if (!name || !page || !pageSize || !orderBy) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const data = await getPublicProblemSetsByName(
    name,
    page || 1,
    pageSize || defaultPageSize,
    orderBy as "popular" | "newest",
  );

  return NextResponse.json(data);
}
