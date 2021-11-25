"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const Event_1 = __importDefault(require("./Event"));
class EventManager {
    constructor(client, evFolder) {
        this.client = client;
        if (evFolder) {
            this.eventsFolder = evFolder;
        }
        else {
            this.eventsFolder = (0, path_1.join)(__dirname, "..", "Events");
        }
        this.events = [];
    }
    registerEvent(eventName, eventFunction) {
        this.events.push(new Event_1.default(eventName, eventFunction));
    }
    registerEventsFromEventFolder() {
        return __awaiter(this, void 0, void 0, function* () {
            const eventFiles = yield (0, fs_1.readdirSync)(this.eventsFolder, "utf-8").filter((x) => x.endsWith(".js"));
            for (var i = 0; i < eventFiles.length; i++) {
                const eventFile = eventFiles[i];
                const event = yield Promise.resolve().then(() => __importStar(require((0, path_1.join)(this.eventsFolder, eventFile)))).then((d) => d.default);
                this.events.push(new Event_1.default(event.name, event.exec));
            }
            return this.events;
        });
    }
    listenEvents() {
        for (var i = 0; i < this.events.length; i++) {
            const event = this.events[i];
            try {
                this.client.on(event.name, (data) => __awaiter(this, void 0, void 0, function* () {
                    yield event.exec(this.client, data);
                }));
            }
            catch (err) {
                this.client.logger.error(`An error happened while loading event ${event.name}. ${this.client.config.debugMode
                    ? "\n \n" + this.client.utils.parseError(err)
                    : ""}`);
                break;
            }
        }
    }
}
exports.default = EventManager;
