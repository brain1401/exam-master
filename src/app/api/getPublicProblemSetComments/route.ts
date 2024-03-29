import { getPublicProblemSetComments } from "@/service/problems";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const problemSetUUID = searchParams.get("problemSetUUID");
  if(!problemSetUUID) {
    return NextResponse.json({error: "problemSetUUID is required"}, {status: 400});
  }

  const comments = await getPublicProblemSetComments(problemSetUUID);

  return NextResponse.json({comments});
}