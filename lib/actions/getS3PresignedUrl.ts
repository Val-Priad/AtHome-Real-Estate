"use server";

import { s3Client } from "@/lib/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

export async function getS3PresignedUrl(fileName: string, fileType: string) {
  const ext = fileName.split(".").pop();
  const key = `uploads/${randomUUID()}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 }); // 1 min

  const publicUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return { uploadUrl, publicUrl };
}
