import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  fileModel: { type: String, required: true },
  category: { type: String, required: true },
});

const FileModel = mongoose.model("files", schema);

export default FileModel;
