import type { S3Client } from "@aws-sdk/client-s3";
import type { PrismaClient } from "@prisma/client";
declare global {
  namespace globalThis {
    var _s3: S3Client;
    var prisma: PrismaClient;
  }
}
