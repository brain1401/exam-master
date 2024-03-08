import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { s3Client } from "@/utils/AWSs3Client";
import { GetObjectCommand } from "@aws-sdk/client-s3";
export async function GET(req: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  const searchParams = req.nextUrl.searchParams;

  const imageKey = searchParams.get("imageKey");

  if (!imageKey) {
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

  const getObjectCommand = new GetObjectCommand({
    Bucket: bucket,
    Key: imageKey,
  });

  try {
    const response = await s3Client.send(getObjectCommand);
    const file = await new File([await response.Body?.transformToByteArray() as Buffer], imageKey);
    const contentType = response.ContentType;
    const contentLength = response.ContentLength;

    return NextResponse.json(
      {
        image: file,
        contentType,
        contentLength,
      },
      {
        status: 200,
      },
    );
  } catch (e) {
    return NextResponse.json(
      { error: "이미지를 찾을 수 없습니다." },
      {
        status: 404,
      },
    );
  }

}