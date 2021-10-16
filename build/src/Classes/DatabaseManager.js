"use strict";
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
const dayjs_1 = __importDefault(require("dayjs"));
const mongoose_1 = __importDefault(require("mongoose"));
const Logger_1 = __importDefault(require("./Logger"));
class DatabaseManager {
    constructor(url) {
        if (url) {
            this.url = url;
        }
        else {
            throw new Error("Cannot create database manager instance without a database url.");
        }
        this.connected = false;
        this.connection = mongoose_1.default.connection;
        this.logger = new Logger_1.default();
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield mongoose_1.default.connect(this.url);
                this.connected = true;
                return true;
            }
            catch (err) {
                this.logger.error("An error occured while trying to connect database server.");
                return false;
            }
        });
    }
    createDocument(collection, document) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.connected)
                return false;
            Object.assign(document, { lastUpdated: (0, dayjs_1.default)().format("L LT") });
            try {
                yield this.connection.collection(collection).insertOne(document);
                return true;
            }
            catch (err) {
                console.error(err);
                return false;
            }
        });
    }
    updateDocument(collection, documentId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.connected)
                return false;
            try {
                this.connection
                    .collection(collection)
                    .updateOne({ _id: documentId }, query);
                return true;
            }
            catch (err) {
                console.error(err);
                return false;
            }
        });
    }
    removeDocument(collection, documentId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.connected)
                return false;
            try {
                yield this.connection
                    .collection(collection)
                    .deleteOne({ _id: documentId });
                return true;
            }
            catch (err) {
                console.error(err);
                return false;
            }
        });
    }
    getDocument(collection, documentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const document = yield this.connection
                    .collection(collection)
                    .findOne({ _id: documentId });
                return document;
            }
            catch (err) {
                console.error(err);
                return null;
            }
        });
    }
}
exports.default = DatabaseManager;
