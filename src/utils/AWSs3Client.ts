import {
  S3Client,
} from "@aws-sdk/client-s3";

let s3Client: S3Client;

if (process.env.NODE_ENV === "development") {
  if (!global._s3) {
    global._s3 = new S3Client({
      region: process.env.AWS_S3_REGION as string,
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
      },
    });
  }
  s3Client = global._s3;
} else {
  s3Client = new S3Client({
    region: process.env.AWS_S3_REGION as string,
    credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
    },
  });
}
export { s3Client };
