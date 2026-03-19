import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import z from "zod";

const logger = new Logger("ConfigurationModule");

const configSchema = z.object({
  env: z.enum(["local", "staging", "production"]).default("local"),
  port: z.string().transform(Number).default(8080),
  databaseUri: z.string(),
  databaseUser: z.string(),
  databasePassword: z.string(),
  r2Endpoint: z.string().url().optional(),
  r2AccessKeyId: z.string().optional(),
  r2SecretAccessKey: z.string().optional(),
  r2BucketName: z.string().optional(),
});

const configuration = () => ({
  env: process.env.ENV,
  port: process.env.PORT,
  databaseUri: process.env.DATABASE_URI,
  databaseUser: process.env.DATABASE_USER,
  databasePassword: process.env.DATABASE_PASSWORD,
  r2Endpoint: process.env.R2_ENDPOINT,
  r2AccessKeyId: process.env.R2_ACCESS_KEY_ID,
  r2SecretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  r2BucketName: process.env.R2_BUCKET_NAME,
});

export type ConfigType = z.infer<typeof configSchema>;

const validateAndLoadConfig = () => {
  try {
    return configSchema.parse(configuration());
  } catch (error) {
    logger.error("Configuration validation error.", error);
    process.exit(1);
  }
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [validateAndLoadConfig],
    }),
  ],
})
export class ConfigurationModule {}
