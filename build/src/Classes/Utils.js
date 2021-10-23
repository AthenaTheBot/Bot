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
        return `\n──────────────────────────────────────────────────\n[\x1b[41mERROR NAME\x1b[0m]: ${error.name} \n\n[\x1b[41mERROR MESSAGE\x1b[0m]:  ${error.message} \n\n[\x1b[41mERROR STACK\x1b[0m]: ${error.stack}\n──────────────────────────────────────────────────`;
    }
}
exports.default = Utils;
