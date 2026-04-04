import { ConsoleLogger, type ConsoleLoggerOptions } from "@nestjs/common";
import { appendFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

export class AppLogger extends ConsoleLogger {
  private readonly logDir: string;

  constructor(options: ConsoleLoggerOptions & { logDir?: string }) {
    super(options);
    this.logDir = options?.logDir ?? "logs";

    try {
      mkdirSync(this.logDir, { recursive: true });
    } catch {
      // App still starts even if directory creation fails; writes will be silently skipped.
    }
  }

  override error(message: unknown, ...rest: unknown[]): void {
    super.error(message, ...rest);
    this.writeToFile(message, rest);
  }

  private getDailyFilePath(): string {
    const date = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    return join(this.logDir, `${date}.log`);
  }

  private writeToFile(message: unknown, rest: unknown[]): void {
    try {
      const timestamp = new Date().toISOString();
      const context = this.context ?? (typeof rest.at(-1) === "string" ? rest.at(-1) : "");
      const stack = rest.find((arg) => typeof arg === "string" && arg.includes("\n    at "));
      const messageStr = typeof message === "string" ? message : JSON.stringify(message);

      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      let entry = `[${timestamp}] ERROR [${context}] ${messageStr}\n`;
      if (stack) {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        entry += `  ${String(stack).split("\n").join("\n  ")}\n`;
      }

      appendFileSync(this.getDailyFilePath(), entry, "utf8");
    } catch {
      // Never let a failed file write crash the application.
    }
  }
}
