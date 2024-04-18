import { hashKey } from "@/const/hashKey";
import { SHA256 } from "crypto-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  const passwordHash =
    "98c3c9ed9c0eda8c835648afc3e10c495b998d6656635e81319e25eb3dcc2ce7";

  const hash = SHA256(password, { hashKey: hashKey }).toString();

  if (hash === passwordHash) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ success: false });
  }
}
