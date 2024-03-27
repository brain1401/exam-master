import { getPublicProblemSets } from "@/service/problems";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const param = req.nextUrl.searchParams;
  const page = param.get("page");
  const pageSize = param.get("pageSize");

  try {
    const data = await getPublicProblemSets(page || "1", pageSize || "10");
    return NextResponse.json(data);
  } catch (e) {
    console.log(e);
  }
}
