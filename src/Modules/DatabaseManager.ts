// Modules
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import mongoose, { Connection } from "mongoose";

dayjs.extend(localizedFormat);

// Classes
import Logger from "./Logger";

/**
 * Helps for connecting to the database and editing docuemnts etc.
 */
class DatabaseManager {
  url: string;
  ready: boolean;
  connection: Connection;
  private logger: Logger;

  constructor(url: string) {
    if (url) {
      this.url = url;
    } else {
      throw new Error(
        "Cannot create database manager instance without a database url."
      );
    }
    this.ready = false;
    this.connection = mongoose.connection;

    this.logger = new Logger();
  }

  // Connects to the database
  async connect(): Promise<boolean> {
    try {
      await mongoose.connect(this.url);
      this.ready = true;
      return true;
    } catch (err) {
      this.logger.error(
        "An error occured while trying to connect database server."
      );
      return false;
    }
  }

  // Creates documents inside of the specified collection
  async createDocument(
    collection: string,
    document: object,
    addLastUpdated = true
  ): Promise<boolean> {
    let d = <any>document;
    if (!this.ready) return false;

    const itemExists =
      (await this.connection
        .collection(collection)
        .count({ _id: d?.id }, { limit: 1 })) == 1
        ? true
        : false;

    if (itemExists) return false;

    // Update last updated column
    if (addLastUpdated) {
      const time = dayjs().format("L LT");
      Object.assign(document, { lastUpdated: time });
    }

    try {
      await this.connection.collection(collection).insertOne(document);

      return true;
    } catch (err) {
      this.logger.error(<Error>err);
      return false;
    }
  }

  // Updates the target document
  async updateDocument(
    collection: string,
    documentId: string | number,
    query: any
  ): Promise<boolean> {
    if (!this.ready) return false;

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

      return true;
    } catch (err) {
      this.logger.error(<Error>err);
      return false;
    }
  }

  // Remove document from database
  async removeDocument(
    collection: string,
    documentId: string | number
  ): Promise<boolean> {
    if (!this.ready) return false;

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

  // Fetches the specified document
  async getDocument(
    collection: string,
    documentId: string | number
  ): Promise<object | null> {
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

export default DatabaseManager;
