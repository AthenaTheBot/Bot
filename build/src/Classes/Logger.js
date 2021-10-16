"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
const Utils_1 = __importDefault(require("./Utils"));
class Logger {
    constructor(dTag, stag, wtag, etag) {
        if (dTag)
            this.defaultTag = dTag;
        else
            this.defaultTag = '\x1b[47m\x1b[30m LOG \x1b[0m"';
        if (stag)
            this.successTag = stag;
        else
            this.successTag = '\x1b[42m\x1b[30m SUCCESS \x1b[0m"';
        if (wtag)
            this.warnTag = wtag;
        else
            this.warnTag = "\x1b[43m\x1b[30m WARN \x1b[0m";
        if (etag)
            this.errorTag = etag;
        else
            this.errorTag = "\x1b[41m\x1b[30m ERROR \x1b[0m";
        this.utils = new Utils_1.default();
    }
    _log(tag, msg) {
        const date = (0, dayjs_1.default)(Date.now()).format("DD/MM/YYYY hh:mm");
        console.log(`[${date}] ${tag} ${msg}`);
    }
    log(msg) {
        this._log(this.defaultTag, msg);
    }
    success(msg) {
        this._log(this.successTag, msg);
    }
    warn(msg) {
        this._log(this.warnTag, msg);
    }
    error(msg) {
        if (msg instanceof Error)
            msg = this.utils.parseError(msg);
        this._log(this.errorTag, msg);
    }
}
exports.default = Logger;
