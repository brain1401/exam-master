import { getPublicProblemSetsByName } from "@/service/problems";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const param = req.nextUrl.searchParams;

  const name = param.get("name");
  const page = param.get("page");
  const pageSize = param.get("pageSize");

  if (!name)
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });

  const data = await getPublicProblemSetsByName(
    name,
    page || "1",
    pageSize || "10",
  );

  return NextResponse.json(data);
}
