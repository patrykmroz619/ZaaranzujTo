import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@Injectable()
export class CloudStorageService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly logger = new Logger(CloudStorageService.name);

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get<string>("R2_BUCKET_NAME") || "";

    this.s3Client = new S3Client({
      region: "auto",
      endpoint: this.configService.get<string>("R2_ENDPOINT"),
      credentials: {
        accessKeyId: this.configService.get<string>("R2_ACCESS_KEY_ID") || "",
        secretAccessKey: this.configService.get<string>("R2_SECRET_ACCESS_KEY") || "",
      },
      forcePathStyle: true,
    });
  }

  async uploadFile(key: string, body: Buffer | Uint8Array, contentType: string): Promise<void> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: body,
        ContentType: contentType,
      });

      await this.s3Client.send(command);
    } catch (error) {
      this.logger.error(`Failed to upload file for key: ${key}`, error);
      throw new Error("Could not upload file to storage", { cause: error });
    }
  }

  async downloadFile(key: string): Promise<{ buffer: Buffer; contentType: string }> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);
      const byteArray = await response.Body?.transformToByteArray();

      if (!byteArray) {
        throw new Error("Empty response body");
      }

      return {
        buffer: Buffer.from(byteArray),
        contentType: response.ContentType || "application/octet-stream",
      };
    } catch (error) {
      this.logger.error(`Failed to download file for key: ${key}`, error);
      throw new Error("Could not download file from storage", { cause: error });
    }
  }

  async getSignedDownloadUrl(key: string, expiresInSeconds: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn: expiresInSeconds });
    } catch (error) {
      this.logger.error(`Failed to generate signed URL for key: ${key}`, error);
      throw new Error("Could not generate secure download link", { cause: error });
    }
  }
}
