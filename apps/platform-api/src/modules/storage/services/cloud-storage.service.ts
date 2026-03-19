import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
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
