import { S3Client } from "@aws-sdk/client-s3";
import { env } from "@/env";

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

// R2 버킷 이름
export const R2_BUCKET_NAME = env.R2_BUCKET_NAME;

// R2 공개 URL
export const R2_PUBLIC_URL = env.R2_PUBLIC_URL;
