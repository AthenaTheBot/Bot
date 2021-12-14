// Modules
import { join } from "path";
import { readFileSync } from "fs";

interface Botlist {
  name: string;
  url: string;
  header: any;
  body: any;
  token: string;
}

interface configInterface {
  debugMode: boolean;
  bot: {
    token: string;
    activity: string;
    statPostInterval: number;
  };
  webhooks: {
    error: string;
  };
  defaults: {
    language: string;
  };
  api_keys: {
    KSOFT: string;
  };
  botlists: Botlist[];
  db_url: string;
}

class Utils {
  configPath: string;
  constructor(configPath?: string) {
    if (configPath) {
      this.configPath = configPath;
    } else {
      this.configPath = join(__dirname, "..", "..", "..", "config.json");
    }
  }

  loadConfig(): configInterface {
    return JSON.parse(readFileSync(this.configPath, { encoding: "utf-8" }));
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
export { configInterface };
