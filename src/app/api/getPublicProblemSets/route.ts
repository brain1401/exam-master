import { defaultPageSize } from "@/const/pageSize";
import { getPublicProblemSets } from "@/service/problems";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const param = req.nextUrl.searchParams;
  const page = Number(param.get("page"));
  const pageSize = Number(param.get("pageSize"));

  try {
    const data = await getPublicProblemSets(page || 1, pageSize || defaultPageSize);
    return NextResponse.json(data);
  } catch (e) {
    console.log(e);
  }
}
