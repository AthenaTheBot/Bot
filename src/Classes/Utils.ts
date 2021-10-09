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

  parseError(error : Error) : string {
    return `[ERROR NAME]: ${error.name} \n \n  [ERROR MESSAGE]:  ${error.message} \n \n [ERROR STACK]: ${error.stack}`;
  }
}

export default Utils;
