import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { s3Client } from "@/utils/AWSs3Client";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { validateS3Key } from "@/service/problems";

export async function GET(req: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  const searchParams = req.nextUrl.searchParams;
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json(
      { error: "잘못된 요청입니다." },
      {
        status: 400,
      },
    );
  }

  if (validateS3Key(key) === false) {
    return NextResponse.json(
      { error: "잘못된 요청입니다." },
      {
        status: 400,
      },
    );
  }

  const bucket = process.env.AWS_S3_BUCKET_NAME;
  if (!bucket) {
    return NextResponse.json(
      { error: "환경 변수가 올바르지 않습니다." },
      {
        status: 500,
      },
    );
  }

  const url = await createPresignedPost(s3Client, {
    Bucket: bucket,
    Key: key,
    Conditions: [
      ["content-length-range", 0, 10485760], // 10MB
      ["starts-with", "$Content-Type", "image/"],
    ],
    Expires: 20,
  });

  console.log(url);

  return NextResponse.json(url);
}
