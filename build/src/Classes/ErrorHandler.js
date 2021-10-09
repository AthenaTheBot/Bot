"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
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
    }
    recordError(error) {
        (0, fs_1.writeFileSync)((0, path_1.join)(this.errorFolder, error.name), `[ERROR NAME] : ${error.name} \n \n  [ERROR MESSAGE] :  ${error.message} \n \n [ERROR STACK] : ${error.stack}`, {
            encoding: "utf-8",
        });
    }
}
