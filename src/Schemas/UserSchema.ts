import { Schema } from "mongoose";

const UserSchema = new Schema({
  _id: String,
  settings: {
    language: String,
    premimum: Boolean,
  },
  lastUpdated: String,
});

export default UserSchema;
