import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import z from "zod";

const creditPackageSchema = z
  .object({
    packageCode: z.string().min(1),
    name: z.string().min(1),
    credits: z.number().int().positive(),
    price: z.object({
      amount: z.number().positive(),
      currency: z.string().length(3),
    }),
    isActive: z.boolean().default(true),
  })
  .strict();

const creditPackagesSchema = z.array(creditPackageSchema);

export type TCreditPackageConfig = z.infer<typeof creditPackageSchema>;

@Injectable()
export class CreditPackagesConfig {
  private readonly logger = new Logger(CreditPackagesConfig.name);
  private readonly packages: TCreditPackageConfig[];

  constructor(private readonly configService: ConfigService) {
    this.packages = this.loadPackages();
  }

  getAll = (): TCreditPackageConfig[] => {
    return this.packages;
  };

  getActive = (): TCreditPackageConfig[] => {
    return this.packages.filter((item) => item.isActive);
  };

  private loadPackages = (): TCreditPackageConfig[] => {
    const sourceValue = this.configService.get<string>("CREDIT_PACKAGES_JSON") ?? "[]";

    try {
      const parsedValue = JSON.parse(sourceValue) as unknown;
      const parsedPackages = creditPackagesSchema.parse(parsedValue);

      this.validateNoDuplicatePackageCodes({ packages: parsedPackages });

      return parsedPackages;
    } catch (error) {
      this.logger.error("Invalid CREDIT_PACKAGES_JSON value.", error as Error);
      throw new Error("Invalid credit package configuration.", { cause: error });
    }
  };

  private validateNoDuplicatePackageCodes = (params: { packages: TCreditPackageConfig[] }): void => {
    const { packages } = params;

    const seenCodes = new Set<string>();

    for (const item of packages) {
      if (seenCodes.has(item.packageCode)) {
        throw new Error(`Duplicate packageCode in credit packages config: ${item.packageCode}`);
      }

      seenCodes.add(item.packageCode);
    }
  };
}
