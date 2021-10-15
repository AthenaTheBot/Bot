// Modules
import { Schema } from "mongoose";

// Main Class
class Guild {
  _id: string;
  settings: object;
  modules: object;

  constructor(id: string) {
    this._id = id;
    this.settings = {
      premium: false,
      prefix: "at!",
      language: "en-US",
    };
    this.modules = {
      moderationModule: {},
      funModule: {},
      utilsModule: {},
    };
  }
}

// Schema
const GuildSchema = new Schema({
  _id: String,
  settings: {
    premium: Boolean,
    prefix: String,
    language: String,
  },
  modules: {
    moderationModule: {},
    funModule: {},
    utilsModule: {},
  },
  lastUpdated: String,
});

export { Guild, GuildSchema };
