// Modules
import { writeFileSync } from "fs";
import { join } from "path";
import fetch from "cross-fetch";

// Classes
import Logger from "./Logger";

// Interfaces
import { configInterface } from "../Interfaces";

class ErrorHandler {
  readonly errorFolder: string;
  private config: configInterface;
  private logger: Logger;

  constructor(config: configInterface, errorFolder?: string) {
    this.config = config;

    if (errorFolder) {
      this.errorFolder = errorFolder;
    } else {
      this.errorFolder = join(__dirname, "..", "..", "errors");
    }

    this.logger = new Logger();
  }

  parseError(error: Error): string {
    return `[ERROR NAME]: ${error.name} \n \n  [ERROR MESSAGE]:  ${error.message} \n \n [ERROR STACK]: ${error.stack}`;
  }

  recordError(error: Error): boolean {
    try {
      writeFileSync(
        join(this.errorFolder, error.name),
        this.parseError(error),
        {
          encoding: "utf-8",
        }
      );
    } catch (err) {
      this.logger.error(
        `An error occured while trying to save a error record file. \n ${this.parseError(
          <Error>err
        )}`
      );
      return false;
    }

    this.logger.warn(`Recorded an error with name [${error.name}].`);
    return true;
  }

  reportError(error: Error): boolean {
    fetch(this.config.webhooks.error, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: `[ERROR NAME]: \`\`\`${error.name}\`\`\` \n \n [ERROR MESSAGE] \`\`\`${error.message}\`\`\` \n \n [ERROR STACK] \`\`\`${error.stack}\`\`\``,
      }),
    });
    return true;
  }
}

export default ErrorHandler;
