// Modules
import { writeFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";
import { v4 as uuid } from "uuid";

// Classes
import Logger from "./Logger";
import Utils from "./Utils";

// Interfaces
import { configInterface } from "../Classes/Utils";

class ErrorHandler {
  readonly errorFolder: string;
  private config: configInterface;
  private logger: Logger;
  private utils: Utils;

  constructor(config: configInterface, errorFolder?: string) {
    this.config = config;

    if (errorFolder) {
      this.errorFolder = errorFolder;
    } else {
      this.errorFolder = join(__dirname, "..", "..", "..", "errors");
    }

    this.logger = new Logger();
    this.utils = new Utils();
  }

  async checkErrors(notify: boolean): Promise<string[] | null> {
    const errorFiles = readdirSync(this.errorFolder).filter((file) =>
      file.endsWith(".athena_error")
    );
    const errors = [];
    for (var i = 0; i < errorFiles.length; i++) {
      errors.push(
        errorFiles[i].slice(0, errorFiles.length - "athena_error".length)
      );
    }

    if (notify && errors.length) {
      this.logger.warn(
        `Found ${errors.length} error file(s) in errors folder from recent session.`
      );
    }

    return errors.length === 0 ? null : errors;
  }

  recordError(error: Error): boolean {
    const errorId = uuid();

    Object.assign(error, { id: errorId });

    const errorFolderExists = existsSync(this.errorFolder);

    if (!errorFolderExists) mkdirSync(this.errorFolder);

    try {
      writeFileSync(
        join(this.errorFolder, errorId + ".athena_error"),
        this.utils.parseError(error, false),
        {
          encoding: "utf-8",
        }
      );
    } catch (err) {
      this.logger.error(
        `An error occured while trying to save a error record file. \n ${this.utils.parseError(
          <Error>err,
          true
        )}`
      );
      return false;
    }

    this.logger.warn(`Recorded an error with name ${error.name} (${errorId}).`);
    return true;
  }
}

export default ErrorHandler;
