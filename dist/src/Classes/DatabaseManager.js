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
const localizedFormat_1 = __importDefault(require("dayjs/plugin/localizedFormat"));
const mongoose_1 = __importDefault(require("mongoose"));
dayjs_1.default.extend(localizedFormat_1.default);
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
        this.documentCache = [];
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
    applySetQueryToObject(obj, path, value) {
        let first;
        let rest;
        if (Array.isArray(path)) {
            first = path[0];
            rest = path.filter((x) => x !== path[0]);
        }
        else {
            const p = path.split(".");
            first = p[0];
            rest = p.filter((x) => x !== p[0]);
        }
        return Object.assign(Object.assign({}, obj), { [first]: rest.length > 0
                ? this.applySetQueryToObject(obj[first], rest, value)
                : value });
    }
    applyPushQueryToObject(obj, path, value) {
        let first;
        let rest;
        if (Array.isArray(path)) {
            first = path[0];
            rest = path.filter((x) => x !== path[0]);
        }
        else {
            const p = path.split(".");
            first = p[0];
            rest = p.filter((x) => x !== p[0]);
        }
        return Object.assign(Object.assign({}, obj), { [first]: rest.length > 0
                ? this.applyPushQueryToObject(obj[first], rest, value)
                : [...obj[first], value] });
    }
    applyDBQueryToObject(document, query) {
        const queryTypes = Object.getOwnPropertyNames(query);
        const q = query;
        if (queryTypes.includes("$set")) {
            const setOperations = Object.getOwnPropertyNames(q["$set"]);
            for (var i = 0; i < setOperations.length; i++) {
                document = this.applySetQueryToObject(document, setOperations[i], q["$set"][setOperations[i]]);
            }
        }
        if (queryTypes.includes("$push")) {
            const pushOperations = Object.getOwnPropertyNames(q["$push"]);
            for (var i = 0; i < pushOperations.length; i++) {
                const value = q["$push"][pushOperations[i]];
                const val = Array.isArray(value) ? value : [value];
                for (var y = 0; y < val.length; y++) {
                    document = this.applyPushQueryToObject(document, pushOperations[i], val[y]);
                }
            }
        }
        return document;
    }
    createDocument(collection, document) {
        return __awaiter(this, void 0, void 0, function* () {
            let d = document;
            if (!this.connected || !(d === null || d === void 0 ? void 0 : d._id))
                return false;
            const itemExists = (yield this.connection
                .collection(collection)
                .count({ _id: d === null || d === void 0 ? void 0 : d.id }, { limit: 1 })) == 1
                ? true
                : false;
            if (itemExists)
                return false;
            const time = (0, dayjs_1.default)().format("L LT");
            Object.assign(document, { lastUpdated: time });
            try {
                yield this.connection.collection(collection).insertOne(document);
                this.documentCache.push(document);
                return true;
            }
            catch (err) {
                this.logger.error(err);
                return false;
            }
        });
    }
    updateDocument(collection, documentId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.connected)
                return false;
            const time = (0, dayjs_1.default)().format("L LT");
            if (Object.keys(query).includes("$set")) {
                Object.assign(query.$set, {
                    lastUpdated: time,
                });
            }
            else {
                Object.assign(query, {
                    $set: {
                        lastUpdated: time,
                    },
                });
            }
            try {
                this.connection
                    .collection(collection)
                    .updateOne({ _id: documentId }, query);
                const document = this.documentCache.find((x) => x._id === documentId);
                let newDocument;
                if (!document) {
                    newDocument = yield this.getDocument(collection, documentId);
                }
                else {
                    this.documentCache = this.documentCache.filter((x) => x._id !== documentId);
                    newDocument = this.applyDBQueryToObject(document, query);
                }
                if (newDocument)
                    this.documentCache.push(newDocument);
                return true;
            }
            catch (err) {
                this.logger.error(err);
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
                this.logger.error(err);
                return false;
            }
        });
    }
    getDocument(collection, documentId, getFromCacheIfExists = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const itemExists = this.documentCache.filter((x) => x._id === documentId).length === 0
                ? false
                : true;
            if (getFromCacheIfExists && itemExists) {
                return this.documentCache.find((x) => x._id === documentId);
            }
            else {
                try {
                    const document = yield this.connection
                        .collection(collection)
                        .findOne({ _id: documentId });
                    return document;
                }
                catch (err) {
                    this.logger.error(err);
                    return null;
                }
            }
        });
    }
}
exports.default = DatabaseManager;
