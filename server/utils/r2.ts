import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { createHash } from "crypto";

let s3: S3Client | null = null;

const client = () =>
  (s3 ??= new S3Client({
    region: "auto",
    endpoint: `https://${useRuntimeConfig().r2.accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: useRuntimeConfig().r2.accessKeyId, secretAccessKey: useRuntimeConfig().r2.secretAccessKey },
  }));

const enc = () => {
  const k = Buffer.from(useRuntimeConfig().r2.encryptionKey, "base64");
  return { SSECustomerAlgorithm: "AES256" as const, SSECustomerKey: useRuntimeConfig().r2.encryptionKey, SSECustomerKeyMD5: createHash("md5").update(k).digest("base64") };
};

export async function r2upload(file: Buffer, key: string, contentType: string): Promise<string> {
  await client().send(new PutObjectCommand({ Bucket: useRuntimeConfig().r2.bucketName, Key: key, Body: file, ContentType: contentType, ...enc() }));
  return `/api/files/${key.slice(8)}`;
}

export async function r2get(key: string): Promise<Buffer> {
  const res = await client().send(new GetObjectCommand({ Bucket: useRuntimeConfig().r2.bucketName, Key: key, ...enc() }));
  return Buffer.from(await res.Body!.transformToByteArray());
}

export async function r2delete(key: string): Promise<void> {
  await client().send(new DeleteObjectCommand({ Bucket: useRuntimeConfig().r2.bucketName, Key: key }));
}
