import mongoose from "mongoose";
const Schema = mongoose.Schema;
const urlSchema = new Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortUrlKey: {
    type: String,
    required: true,
  },
});
const URL = mongoose.model("Url", urlSchema);

export default URL;
