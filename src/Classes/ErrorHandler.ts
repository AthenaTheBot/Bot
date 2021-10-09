// Modules
import { writeFileSync } from "fs";
import { join } from "path";

// Classes
import Logger from "./Logger";

class ErrorHandler {
  errorFolder: string;
  debugMode: boolean;
  private logger: Logger

  constructor(errorFolder: string, debug: boolean) {
    if (errorFolder) {
      this.errorFolder = errorFolder;
    } else {
      this.errorFolder = join(__dirname, "..", "..", "errors");
    }

    if (debug) {
      this.debugMode = true;
    } else {
      this.debugMode = false;
    }

    this.logger = new Logger();
  }

  recordError(error: Error) : boolean {
    try {
      writeFileSync(
        join(this.errorFolder, error.name),
        `[ERROR NAME]: ${error.name} \n \n  [ERROR MESSAGE]:  ${error.message} \n \n [ERROR STACK]: ${error.stack}`,
        {
          encoding: "utf-8",
        }
      );
    }
    catch(err) {
      this.logger.error(`An error occured while trying to save a error record file. \n [ERROR NAME]: ${error.name} \n \n  [ERROR MESSAGE]:  ${error.message} \n \n [ERROR STACK]: ${error.stack}`);
      return false;
    }

    this.logger.warn(`Recorded an error file. [${error.name}]`)
    return true;
  }
}

export default ErrorHandler;