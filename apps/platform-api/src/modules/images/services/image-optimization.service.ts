import { Injectable, Logger } from "@nestjs/common";
import sharp from "sharp";

type TImageFile = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};

export type TOptimizeConfig = {
  maxDimensionPx?: number;
  quality?: number;
};

@Injectable()
export class ImageOptimizationService {
  private readonly logger = new Logger(ImageOptimizationService.name);

  optimize = async (file: TImageFile, config?: TOptimizeConfig): Promise<TImageFile> => {
    this.logger.debug(`[optimize] originalname=${file.originalname} originalSize=${file.size}B`);

    let pipeline = sharp(file.buffer);

    if (config?.maxDimensionPx !== undefined) {
      pipeline = pipeline.resize({
        width: config.maxDimensionPx,
        height: config.maxDimensionPx,
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    const avifOptions =
      config?.quality !== undefined ? { quality: config.quality } : { lossless: true };
    const optimizedBuffer = await pipeline.avif(avifOptions).toBuffer();

    this.logger.debug(
      `[optimize] optimizedSize=${optimizedBuffer.byteLength}B ` +
        `reduction=${Math.round((1 - optimizedBuffer.byteLength / file.size) * 100)}%`,
    );

    return {
      originalname: file.originalname.replace(/\.[^.]+$/, ".avif"),
      mimetype: "image/avif",
      size: optimizedBuffer.byteLength,
      buffer: optimizedBuffer,
    };
  };

  optimizeAll = async (files: TImageFile[], config?: TOptimizeConfig): Promise<TImageFile[]> =>
    Promise.all(files.map((f) => this.optimize(f, config)));
}
