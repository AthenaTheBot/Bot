"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const uuid_1 = require("uuid");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const Logger_1 = __importDefault(require("./Logger"));
const Utils_1 = __importDefault(require("./Utils"));
class ErrorHandler {
    constructor(config, errorFolder) {
        this.config = config;
        if (errorFolder) {
            this.errorFolder = errorFolder;
        }
        else {
            this.errorFolder = (0, path_1.join)(__dirname, "..", "..", "..", "errors");
        }
        this.logger = new Logger_1.default();
        this.utils = new Utils_1.default();
    }
    recordError(error) {
        const errorId = (0, uuid_1.v4)();
        Object.assign(error, { id: errorId });
        try {
            (0, fs_1.writeFileSync)((0, path_1.join)(this.errorFolder, errorId + ".athena_error"), this.utils.parseError(error, false), {
                encoding: "utf-8",
            });
        }
        catch (err) {
            this.logger.error(`An error occured while trying to save a error record file. \n ${this.utils.parseError(err, true)}`);
            return false;
        }
        this.logger.warn(`Recorded an error with name ${error.name} (${errorId}).`);
        return true;
    }
    reportError(error) {
        (0, cross_fetch_1.default)(this.config.webhooks.error, {
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
exports.default = ErrorHandler;
