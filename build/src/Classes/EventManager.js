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
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
class EventManager {
    constructor(AthenaClient, evFolder) {
        if (evFolder) {
            this.eventsFolder = evFolder;
        }
        else {
            this.eventsFolder = (0, path_1.join)(__dirname, "..", "Events");
        }
        this.events = [];
    }
    registerEvent(eventName, eventFunction) {
        this.events.push({
            eventName: eventName,
            eventFunction: eventFunction,
        });
    }
    registerEventsFromEventFolder() {
        const eventFiles = (0, fs_1.readdirSync)(this.eventsFolder, "utf-8").filter((x) => x.endsWith(".ts"));
        eventFiles.forEach((eventFile) => {
            Promise.resolve().then(() => __importStar(require((0, path_1.join)(this.eventsFolder, eventFile)))).then((event) => {
                this.events.push({
                    eventName: event.name,
                    eventFunction: event.function,
                });
            });
        });
    }
}
exports.default = EventManager;
