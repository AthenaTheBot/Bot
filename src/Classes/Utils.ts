// Modules
import { join } from "path";
import { readFileSync } from "fs";

class Utils {
  configPath: string;
  constructor(configPath?: string) {
    if (configPath) {
      this.configPath = configPath;
    } else {
      this.configPath = join(__dirname, "..", "..", "config.json");
    }
  }

  loadConfig(): object {
    return JSON.parse(readFileSync(this.configPath, { encoding: "utf-8" }));
  }

  parseError(error: Error): string {
    return `\n──────────────────────────────────────────────────\n[\x1b[41mERROR NAME\x1b[0m]: ${error.name} \n\n[\x1b[41mERROR MESSAGE\x1b[0m]:  ${error.message} \n\n[\x1b[41mERROR STACK\x1b[0m]: ${error.stack}\n──────────────────────────────────────────────────`;
  }
}

export default Utils;
