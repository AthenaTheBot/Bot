"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AthenaClient_1 = __importDefault(require("./src/AthenaClient"));
const Utils_1 = __importDefault(require("./src/Classes/Utils"));
const AthenaUtils = new Utils_1.default();
const Athena = new AthenaClient_1.default(AthenaUtils.loadConfig());
Athena.initalize();
process.on("uncaughtExceptionMonitor", (err) => {
    Athena.errorHandler.recordError(err);
});
process.on("unhandledRejection", (err) => {
    Athena.errorHandler.recordError(err);
});
