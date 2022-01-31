import { Schema } from "mongoose";

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

export default GuildSchema;
