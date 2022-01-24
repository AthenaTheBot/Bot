// Modules
import { join } from "path";
import { readFile, readFileSync } from "fs";
import { Botlist, Config } from "../constants";

class Utils {
  configPath: string;
  constructor(configPath?: string) {
    if (configPath) {
      this.configPath = configPath;
    } else {
      this.configPath = join(__dirname, "..", "..", "..", "config.json");
    }
  }

  loadConfig(): Config {
    try {
      const config = JSON.parse(
        readFileSync(this.configPath, { encoding: "utf-8" })
      ) as Config;
      return config;
    } catch (err) {
      throw err;
    }
  }

  parseError(error: Error, addColors?: boolean): string {
    let errorString =
      "[$color_redERROR MESSAGE$color_reset]: $error_name\n\n[$color_redERROR MESSAGE$color_reset]: $error_message\n\n[$color_redERROR STACK$color_reset]: $error_stack"
        .replace("$error_name", error.name)
        .replace("$error_message", error.message)
        .replace("$error_stack", error.stack || "None");

    if ((error as any)?.id)
      errorString = `[ERROR ID]: ${(error as any)?.id}\n\n`.concat(errorString);

    if (addColors) {
      return errorString
        .replaceAll("$color_red", "\x1b[31m")
        .replaceAll("$color_reset", "\x1b[0m");
    } else {
      return errorString
        .replaceAll("$color_red", "")
        .replaceAll("$color_reset", "");
    }
  }

  parseDuration(dur: string): number {
    const minSecond = dur.trim().split(":");
    const min = parseInt(minSecond[0]) as number;
    const sec = parseInt(minSecond[1]) as number;
    return min * 60 + sec;
  }

  async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }
}

export default Utils;
