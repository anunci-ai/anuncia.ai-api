import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Uploader, UploadParams } from "../../domain/application/storage/uploader";
import { randomUUID } from "node:crypto";
import { s3Client } from "./r2-client";
import { env } from "../env";

export class R2Storage implements Uploader {
  async upload({ fileName, fileType, body }: UploadParams): Promise<{ url: string }> {
    const uniqueFileName = `${randomUUID()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: env.CLOUDFLARE_BUCKET_NAME,
      Key: uniqueFileName,
      ContentType: fileType,
      Body: body,
    });

    await s3Client.send(command);

    const url = `https://${env.CLOUDFLARE_PUBLIC_URL}/${env.CLOUDFLARE_BUCKET_NAME}/${uniqueFileName}`;

    return { url };
  }
}
