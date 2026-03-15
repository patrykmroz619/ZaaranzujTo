import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import path from "path";
import z from "zod";

const configSchema = z.object({
  env: z.enum(["local", "staging", "production"]).default("local"),
  port: z.string().transform(Number).default(8080),
  databaseUri: z.string(),
  databaseUser: z.string(),
  databasePassword: z.string(),
});

const configuration = () => ({
  env: process.env.ENV,
  port: process.env.PORT,
  databaseUri: process.env.DATABASE_URI,
  databaseUser: process.env.DATABASE_USER,
  databasePassword: process.env.DATABASE_PASSWORD,
});

export type ConfigType = z.infer<typeof configSchema>;

const validateAndLoadConfig = () => {
  try {
    return configSchema.parse(configuration());
  } catch (error) {
    console.error("Configuration validation error:", error);
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
