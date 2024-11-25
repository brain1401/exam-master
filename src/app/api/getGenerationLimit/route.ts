import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { canUserGenerateProblemSet } from "@/service/user";

export async function GET(_: NextRequest) {
  const session = await getServerSession();
  const email = session?.user?.email;
  
  if (!session || !email) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  const canGenerate = await canUserGenerateProblemSet(email);

  return NextResponse.json({ canGenerate });
}
