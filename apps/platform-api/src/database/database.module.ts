import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigType } from "src/config/config.module";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService<ConfigType, true>) => ({
        uri: configService.get("databaseUri"),
        auth: {
          username: configService.get("databaseUser"),
          password: configService.get("databasePassword"),
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
