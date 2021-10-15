// Modules
import dayjs from "dayjs";
import mongoose, { Connection } from "mongoose";

// Classes
import Logger from "./Logger";

class DatabaseManager {
  url: string;
  connected: boolean;
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
    this.connected = false;
    this.connection = mongoose.connection;

    this.logger = new Logger();
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

  // TODO: Record when the document is updated.
  async createDocument(collection: string, document: object): Promise<boolean> {
    if (!this.connected) return false;

    // Update last updated column
    Object.assign(document, { lastUpdated: dayjs().format("L LT") });

    try {
      await this.connection.collection(collection).insertOne(document);

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async updateDocument(
    collection: string,
    documentId: string | number,
    query: object
  ): Promise<boolean> {
    if (!this.connected) return false;

    try {
      this.connection
        .collection(collection)
        .updateOne({ _id: documentId }, query);

      return true;
    } catch (err) {
      console.error(err);
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
      console.error(err);
      return false;
    }
  }

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
      console.error(err);
      return null;
    }
  }
}

export default DatabaseManager;
