"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const Logger_1 = __importDefault(require("./Logger"));
class ErrorHandler {
    constructor(errorFolder, debug) {
        if (errorFolder) {
            this.errorFolder = errorFolder;
        }
        else {
            this.errorFolder = (0, path_1.join)(__dirname, "..", "..", "errors");
        }
        if (debug) {
            this.debugMode = true;
        }
        else {
            this.debugMode = false;
        }
        this.logger = new Logger_1.default();
    }
    recordError(error) {
        try {
            (0, fs_1.writeFileSync)((0, path_1.join)(this.errorFolder, error.name), `[ERROR NAME]: ${error.name} \n \n  [ERROR MESSAGE]:  ${error.message} \n \n [ERROR STACK]: ${error.stack}`, {
                encoding: "utf-8",
            });
        }
        catch (err) {
            this.logger.error(`An error occured while trying to save a error record file. \n [ERROR NAME]: ${error.name} \n \n  [ERROR MESSAGE]:  ${error.message} \n \n [ERROR STACK]: ${error.stack}`);
            return false;
        }
        this.logger.warn(`Recorded an error with name [${error.name}].`);
        return true;
    }
}
exports.default = ErrorHandler;
