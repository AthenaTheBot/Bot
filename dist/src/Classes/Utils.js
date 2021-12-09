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
            this.configPath = (0, path_1.join)(__dirname, "..", "..", "..", "config.json");
        }
    }
    loadConfig() {
        return JSON.parse((0, fs_1.readFileSync)(this.configPath, { encoding: "utf-8" }));
    }
    parseError(error, addColors) {
        var _a, _b;
        let errorString = "[$color_redERROR MESSAGE$color_reset]: $error_name\n\n[$color_redERROR MESSAGE$color_reset]: $error_message\n\n[$color_redERROR STACK$color_reset]: $error_stack"
            .replace("$error_name", error.name)
            .replace("$error_message", error.message)
            .replace("$error_stack", error.stack || "None");
        if ((_a = error) === null || _a === void 0 ? void 0 : _a.id)
            errorString = `[ERROR ID]: ${(_b = error) === null || _b === void 0 ? void 0 : _b.id}\n\n`.concat(errorString);
        if (addColors) {
            return errorString
                .replaceAll("$color_red", "\x1b[31m")
                .replaceAll("$color_reset", "\x1b[0m");
        }
        else {
            return errorString
                .replaceAll("$color_red", "")
                .replaceAll("$color_reset", "");
        }
    }
    parseDuration(dur) {
        const minSecond = dur.trim().split(":");
        const min = parseInt(minSecond[0]);
        const sec = parseInt(minSecond[1]);
        return min * 60 + sec;
    }
}
exports.default = Utils;
