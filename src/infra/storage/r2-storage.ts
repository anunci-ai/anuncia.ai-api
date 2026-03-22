import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Uploader, UploadParams } from "../../domain/application/storage/uploader";
import { randomUUID } from "node:crypto";
// IMPORTANTE: Mude esse caminho para onde o seu amigo exportou o s3Client e o nome do Bucket!
import { s3Client } from "./r2-client";
import { env } from "../env";

export class R2Storage implements Uploader {
  async upload({ fileName, fileType, body }: UploadParams): Promise<{ url: string }> {
    // 1. Criamos um nome único para o arquivo não sobrescrever outro
    const uniqueFileName = `${randomUUID()}-${fileName}`;

    // 2. Montamos o comando de envio para a AWS/Cloudflare
    const command = new PutObjectCommand({
      Bucket: env.CLOUDFLARE_BUCKET_NAME, // A variável que seu amigo configurou
      Key: uniqueFileName,
      ContentType: fileType,
      Body: body,
    });

    // 3. Disparamos o upload
    await s3Client.send(command);

    // 4. Montamos a URL final pública (ajuste o domínio base conforme o seu Cloudflare R2)
    const url = `https://${env.CLOUDFLARE_PUBLIC_URL}/${uniqueFileName}`;

    return { url };
  }
}
