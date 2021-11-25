// Modules
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import mongoose, { Connection } from "mongoose";

dayjs.extend(localizedFormat);

// Classes
import Logger from "./Logger";

class DatabaseManager {
  url: string;
  connected: boolean;
  connection: Connection;
  private logger: Logger;
  private documentCache: any[];

  constructor(url: string) {
    if (url) {
      this.url = url;
    } else {
      throw new Error(
        "Cannot create database manager instance without a database url."
      );
    }
    this.connected = false;
    this.connection = mongoose.connection;

    this.logger = new Logger();

    this.documentCache = [];
  }

  async connect(): Promise<boolean> {
    try {
      await mongoose.connect(this.url);
      this.connected = true;
      return true;
    } catch (err) {
      this.logger.error(
        "An error occured while trying to connect database server."
      );
      return false;
    }
  }

  applySetQueryToObject(obj: any, path: string | string[], value: any): any {
    let first;
    let rest;
    if (Array.isArray(path)) {
      first = path[0];
      rest = path.filter((x) => x !== path[0]);
    } else {
      const p = path.split(".");
      first = p[0];
      rest = p.filter((x) => x !== p[0]);
    }

    return {
      ...obj,
      [first]:
        rest.length > 0
          ? this.applySetQueryToObject(obj[first], rest, value)
          : value,
    };
  }

  // TODO: Create a method which performs push operations for documents.
  applyPushQueryToObject(obj: any, path: string | string[], value: any): any {
    let first;
    let rest;
    if (Array.isArray(path)) {
      first = path[0];
      rest = path.filter((x) => x !== path[0]);
    } else {
      const p = path.split(".");
      first = p[0];
      rest = p.filter((x) => x !== p[0]);
    }

    return {
      ...obj,
      [first]:
        rest.length > 0
          ? this.applyPushQueryToObject(obj[first], rest, value)
          : [...obj[first], value],
    };
  }

  // TODO: Apply all valid mongodb queries to the document
  applyDBQueryToObject(document: object, query: object): object {
    const queryTypes = Object.getOwnPropertyNames(query);
    const q = <any>query;

    // Apply Set Query
    if (queryTypes.includes("$set")) {
      const setOperations = Object.getOwnPropertyNames(q["$set"]);
      for (var i = 0; i < setOperations.length; i++) {
        document = this.applySetQueryToObject(
          document,
          setOperations[i],
          q["$set"][setOperations[i]]
        );
      }
    }

    // Apply Push Query
    if (queryTypes.includes("$push")) {
      const pushOperations = Object.getOwnPropertyNames(q["$push"]);
      for (var i = 0; i < pushOperations.length; i++) {
        const value = q["$push"][pushOperations[i]];
        const val = Array.isArray(value) ? value : [value];
        for (var y = 0; y < val.length; y++) {
          document = this.applyPushQueryToObject(
            document,
            pushOperations[i],
            val[y]
          );
        }
      }
    }

    return document;
  }

  async createDocument(collection: string, document: object): Promise<boolean> {
    let d = <any>document;
    if (!this.connected || !d?._id) return false;

    const itemExists =
      (await this.connection
        .collection(collection)
        .count({ _id: d?.id }, { limit: 1 })) == 1
        ? true
        : false;

    if (itemExists) return false;

    // Update last updated column
    const time = dayjs().format("L LT");
    Object.assign(document, { lastUpdated: time });

    try {
      await this.connection.collection(collection).insertOne(document);

      this.documentCache.push(document);

      return true;
    } catch (err) {
      this.logger.error(<Error>err);
      return false;
    }
  }

  async updateDocument(
    collection: string,
    documentId: string | number,
    query: any
  ): Promise<boolean> {
    if (!this.connected) return false;

    const time = dayjs().format("L LT");
    if (Object.keys(query).includes("$set")) {
      Object.assign(query.$set, {
        lastUpdated: time,
      });
    } else {
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

      // Check if document exists on cache.
      const document = this.documentCache.find((x) => x._id === documentId);
      let newDocument;

      if (!document) {
        // Fetch document then push
        newDocument = await this.getDocument(collection, documentId);
      } else {
        // Remove document from cache
        this.documentCache = this.documentCache.filter(
          (x) => x._id !== documentId
        );

        newDocument = this.applyDBQueryToObject(document, query);
      }

      if (newDocument) this.documentCache.push(newDocument);

      return true;
    } catch (err) {
      this.logger.error(<Error>err);
      return false;
    }
  }

  async removeDocument(
    collection: string,
    documentId: string | number
  ): Promise<boolean> {
    if (!this.connected) return false;

    try {
      await this.connection
        .collection(collection)
        .deleteOne({ _id: documentId });

      return true;
    } catch (err) {
      this.logger.error(<Error>err);
      return false;
    }
  }

  async getDocument(
    collection: string,
    documentId: string | number,
    getFromCacheIfExists = true
  ): Promise<object | null> {
    const itemExists =
      this.documentCache.filter((x) => x._id === documentId).length === 0
        ? false
        : true;

    if (getFromCacheIfExists && itemExists) {
      return this.documentCache.find((x) => x._id === documentId);
    } else {
      try {
        const document = await this.connection
          .collection(collection)
          .findOne({ _id: documentId });

        return document;
      } catch (err) {
        this.logger.error(<Error>err);
        return null;
      }
    }
  }
}

export default DatabaseManager;
