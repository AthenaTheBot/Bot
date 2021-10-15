"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const AthenaClient_1 = __importDefault(require("./src/AthenaClient"));
const Utils_1 = __importDefault(require("./src/Classes/Utils"));
const AthenaUtils = new Utils_1.default();
const config = AthenaUtils.loadConfig();
const Athena = new AthenaClient_1.default(config);
Athena.initalize();
exports.default = config;
exports.logger = Athena.logger;
