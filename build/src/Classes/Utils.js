"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
class Utils {
    constructor(configPath) {
        if (configPath) {
            this.configPath = configPath;
        }
        else {
            this.configPath = (0, path_1.join)(__dirname, "..", "..", "config.json");
        }
    }
    loadConfig() {
        return JSON.parse((0, fs_1.readFileSync)(this.configPath, { encoding: "utf-8" }));
    }
    parseError(error) {
        return `[ERROR NAME]: ${error.name} \n \n  [ERROR MESSAGE]:  ${error.message} \n \n [ERROR STACK]: ${error.stack}`;
    }
}
exports.default = Utils;
